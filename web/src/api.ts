import type { Diagram } from 'isodraw';

/** Client for the IsoDraw API. The session cookie rides along; there is no token to manage. */

export interface User {
  id: string;
  email: string;
  name: string;
}

export type Role = 'owner' | 'admin' | 'editor' | 'viewer';

export interface Org {
  id: string;
  name: string;
  slug: string;
  personal: boolean;
  role: Role;
}

export interface DiagramMeta {
  id: string;
  orgId: string;
  title: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredDiagram extends DiagramMeta {
  content: Diagram;
}

export interface Member {
  userId: string;
  email: string;
  name: string;
  role: Role;
  joinedAt: string;
}

export interface Invite {
  id: string;
  orgId: string;
  email: string;
  role: Role;
  createdAt: string;
  expiresAt: string;
}

/** What an invite link shows before it is accepted. */
export interface InviteDetails extends Invite {
  orgName: string;
  orgSlug: string;
  invitedBy: string;
  accepted: boolean;
  expired: boolean;
}

export type Scope = 'read' | 'write';

export interface ApiToken {
  id: string;
  orgId: string;
  orgName: string;
  name: string;
  scope: Scope;
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly body: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

/** Send the browser to sign in, coming back to where it is now. */
export function signIn(): never {
  window.location.assign(`/auth/login?return=${encodeURIComponent(location.pathname + location.search + location.hash)}`);
  throw new ApiError(401, 'unauthenticated', 'Signing in…');
}

async function request<T>(method: string, path: string, body?: unknown, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const err = (data.error ?? {}) as { code?: string; message?: string };
    throw new ApiError(res.status, err.code ?? 'error', err.message ?? `Request failed (${res.status})`, data);
  }
  return data as T;
}

export const api = {
  me: () => request<{ user: User; orgs: Org[] }>('GET', '/api/me'),
  listDiagrams: (orgId: string) => request<{ diagrams: DiagramMeta[] }>('GET', `/api/orgs/${orgId}/diagrams`),
  createDiagram: (orgId: string, title?: string, content?: Diagram) =>
    request<StoredDiagram>('POST', `/api/orgs/${orgId}/diagrams`, { title, content }),
  getDiagram: (id: string) => request<StoredDiagram>('GET', `/api/diagrams/${id}`),
  /** Save content edited from `version`. A 409 ApiError carries the current diagram in `body.current`. */
  saveContent: (id: string, version: number, content: Diagram) =>
    request<DiagramMeta>('PUT', `/api/diagrams/${id}/content`, content, { 'If-Match': `"${version}"` }),
  rename: (id: string, title: string) => request<DiagramMeta>('PATCH', `/api/diagrams/${id}`, { title }),
  deleteDiagram: (id: string) => request<void>('DELETE', `/api/diagrams/${id}`),
  signOut: () => request<void>('POST', '/auth/logout'),

  createTeam: (name: string) => request<Org>('POST', '/api/orgs', { name }),
  renameOrg: (orgId: string, name: string) => request<Org>('PATCH', `/api/orgs/${orgId}`, { name }),
  /** Members for anyone in the organization; pending invites only for owners and admins. */
  members: (orgId: string) => request<{ members: Member[]; invites: Invite[] }>('GET', `/api/orgs/${orgId}/members`),
  changeRole: (orgId: string, userId: string, role: Role) => request<void>('PATCH', `/api/orgs/${orgId}/members/${userId}`, { role }),
  removeMember: (orgId: string, userId: string) => request<void>('DELETE', `/api/orgs/${orgId}/members/${userId}`),
  /** Invite an address. No email is sent yet: the answer has the link to share. */
  invite: (orgId: string, email: string, role: Role) => request<{ invite: Invite; url: string }>('POST', `/api/orgs/${orgId}/invites`, { email, role }),
  revokeInvite: (orgId: string, inviteId: string) => request<void>('DELETE', `/api/orgs/${orgId}/invites/${inviteId}`),
  getInvite: (token: string) => request<InviteDetails>('GET', `/api/invites/${encodeURIComponent(token)}`),
  acceptInvite: (token: string) => request<Org>('POST', `/api/invites/${encodeURIComponent(token)}/accept`),

  tokens: () => request<{ tokens: ApiToken[] }>('GET', '/api/tokens'),
  /** The secret is in the answer once; it can't be read again. */
  createToken: (name: string, orgId: string, scope: Scope, expiresInDays: number) =>
    request<{ token: ApiToken; secret: string }>('POST', '/api/tokens', { name, orgId, scope, expiresInDays }),
  deleteToken: (id: string) => request<void>('DELETE', `/api/tokens/${id}`),
};
