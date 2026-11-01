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
  /** In lists: a signed link to a small PNG of the diagram, for the grid. */
  thumbnail?: string;
}

export interface StoredDiagram extends DiagramMeta {
  content: Diagram;
}

export interface PreviewLink {
  svg: string;
  url: string;
  title: string;
  expiresAt: string;
}

/** An image uploaded to a workspace, for everyone in it. `url` works without signing in. */
export interface WorkspaceImage {
  id: string;
  orgId: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

/** What a workspace may do under its plan, and how much of it is used. Limits are 0 when there are none. */
export interface Plan {
  /** An owner has lifetime access (in a personal workspace, its person). */
  lifetime: boolean;
  /** A team from before plans: free, with no seat limit. */
  grandfathered: boolean;
  /** False for a team whose owners no longer have lifetime access: readable, not changeable. */
  editable: boolean;
  diagramLimit: number;
  editorLimit: number;
  diagrams: number;
  /** Seats in use: members who can edit plus open invites to edit. */
  editors: number;
}

// ---------- billing ----------

export interface Purchase {
  id: string;
  email: string;
  status: 'pending' | 'paid' | 'expired' | 'refunded';
  amount: number | null;
  currency: string | null;
  /** The buyer's place in the founding cohort. */
  seat: number | null;
  createdAt: string;
  paidAt: string | null;
  refundedAt: string | null;
}

export interface Billing {
  /** Lifetime access can be bought (Stripe is set up). */
  available: boolean;
  lifetime: boolean;
  /** In the currency's smallest unit (cents). */
  price: { amount: number; currency: string };
  seats: { total: number; sold: number; left: number };
  /** The paid purchase behind the user's lifetime access, if they bought it. */
  purchase: Purchase | null;
}

/** "$99" for 9900 usd. */
export function formatPrice(p: { amount: number; currency: string }) {
  const n = new Intl.NumberFormat(undefined, { style: 'currency', currency: p.currency.toUpperCase(), minimumFractionDigits: 0 }).format(p.amount / 100);
  return n.replace(/\.00$/, '');
}

// ---------- platform admin ----------

export interface AdminStats {
  users: number;
  usersLastWeek: number;
  activeWeek: number;
  lifetime: number;
  teams: number;
  diagrams: number;
  images: number;
  imageBytes: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLoginAt: string | null;
  lifetimeSince: string | null;
  platformAdmin: boolean;
  workspaces: number;
  diagrams: number;
}

export interface AdminUserDetail {
  user: AdminUser;
  workspaces: AdminWorkspace[];
  purchases: Purchase[];
}

export interface AdminWorkspace {
  id: string;
  name: string;
  slug: string;
  personal: boolean;
  grandfathered: boolean;
  createdAt: string;
  members: number;
  diagrams: number;
  /** The first owner's email: the person, for a personal workspace. */
  owner: string;
  /** The user's role, when listed for one user. */
  role?: Role;
}

export interface AdminEvent {
  id: string;
  admin: string;
  action: string;
  target: string;
  detail: string;
  createdAt: string;
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
  // A File goes up as its own bytes, typed by its Content-Type; anything else as JSON.
  const raw = body instanceof Blob;
  const res = await fetch(path, {
    method,
    headers: { ...(raw ? { 'Content-Type': body.type } : body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
    body: raw ? body : body !== undefined ? JSON.stringify(body) : undefined,
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

/** The endpoints behind IsoDraw's own sign-in pages (AuthPages). */
export const authApi = {
  config: () => request<{ mode: 'password' | 'redirect' }>('GET', '/auth/config'),
  signUp: (email: string, password: string, name: string) =>
    request<{ next: 'verify'; sentTo: string }>('POST', '/auth/signup', { email, password, name }),
  verify: (email: string, code: string) => request<{ ok: true }>('POST', '/auth/verify', { email, code }),
  resend: (email: string) => request<{ sentTo: string }>('POST', '/auth/resend', { email }),
  signIn: (email: string, password: string) => request<{ ok: true }>('POST', '/auth/signin', { email, password }),
  forgot: (email: string) => request<{ ok: true }>('POST', '/auth/forgot', { email }),
  reset: (email: string, code: string, password: string) => request<{ ok: true }>('POST', '/auth/reset', { email, code, password }),
};

export const api = {
  me: () => request<{ user: User; orgs: Org[]; lifetime: boolean; admin?: boolean }>('GET', '/api/me'),
  plan: (orgId: string) => request<Plan>('GET', `/api/orgs/${orgId}/plan`),
  listDiagrams: (orgId: string) => request<{ diagrams: DiagramMeta[] }>('GET', `/api/orgs/${orgId}/diagrams`),
  createDiagram: (orgId: string, title?: string, content?: Diagram) =>
    request<StoredDiagram>('POST', `/api/orgs/${orgId}/diagrams`, { title, content }),
  getDiagram: (id: string) => request<StoredDiagram>('GET', `/api/diagrams/${id}`),
  /** Save content edited from `version`. A 409 ApiError carries the current diagram in `body.current`. */
  saveContent: (id: string, version: number, content: Diagram) =>
    request<DiagramMeta>('PUT', `/api/diagrams/${id}/content`, content, { 'If-Match': `"${version}"` }),
  rename: (id: string, title: string) => request<DiagramMeta>('PATCH', `/api/diagrams/${id}`, { title }),
  deleteDiagram: (id: string) => request<void>('DELETE', `/api/diagrams/${id}`),
  /** A signed link to a picture of the diagram (or one detail level), viewable without signing in. */
  previewLink: (id: string, level: string[]) =>
    request<PreviewLink>('GET', `/api/diagrams/${id}/preview?${new URLSearchParams(level.length ? { level: level.join('/') } : {})}`),
  signOut: () => request<void>('POST', '/auth/logout'),

  /** The workspace's shared images, for the editor's Images tab. */
  images: (orgId: string) => request<{ images: WorkspaceImage[] }>('GET', `/api/orgs/${orgId}/images`),
  uploadImage: (orgId: string, file: File) =>
    request<WorkspaceImage>('POST', `/api/orgs/${orgId}/images?${new URLSearchParams({ name: file.name.replace(/\.[^.]+$/, '') })}`, file),
  /** Takes an image off the workspace's list; diagrams that use it keep showing it. */
  removeImage: (orgId: string, id: string) => request<void>('DELETE', `/api/orgs/${orgId}/images/${id}`),

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

  billing: () => request<Billing>('GET', '/api/billing'),
  /** Starts Stripe Checkout for lifetime access; the answer is where to send the browser. */
  checkout: () => request<{ url: string }>('POST', '/api/billing/checkout', {}),
  /** Gives back the seat held by an unfinished checkout. */
  cancelCheckout: () => request<void>('POST', '/api/billing/cancel', {}),

  /** Platform admin: every user and workspace (404 for everyone else). */
  admin: {
    stats: () =>
      request<{ stats: AdminStats; events: AdminEvent[]; seats: { total: number; sold: number; pending: number }; checkout: boolean }>(
        'GET',
        '/api/admin/stats',
      ),
    users: (q: string) => request<{ users: AdminUser[]; limit: number }>('GET', `/api/admin/users?${new URLSearchParams({ q })}`),
    user: (id: string) => request<AdminUserDetail>('GET', `/api/admin/users/${id}`),
    updateUser: (id: string, change: { lifetime?: boolean }) => request<AdminUserDetail>('PATCH', `/api/admin/users/${id}`, change),
    workspaces: (q: string, kind: '' | 'team' | 'personal') =>
      request<{ workspaces: AdminWorkspace[]; limit: number }>('GET', `/api/admin/orgs?${new URLSearchParams({ q, kind })}`),
    workspace: (id: string) =>
      request<{ workspace: AdminWorkspace; members: Member[]; invites: Invite[]; plan: Plan }>('GET', `/api/admin/orgs/${id}`),
    updateWorkspace: (id: string, change: { grandfathered?: boolean }) =>
      request<{ workspace: AdminWorkspace; members: Member[]; invites: Invite[]; plan: Plan }>('PATCH', `/api/admin/orgs/${id}`, change),
    events: () => request<{ events: AdminEvent[] }>('GET', '/api/admin/events'),
  },

  /** Connecting an AI app to the MCP server (the consent page). */
  oauthRequest: (clientId: string, redirectUri: string) =>
    request<{ clientName: string; redirectHost: string; redirectScheme: string }>(
      'GET',
      `/api/oauth/request?${new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri })}`,
    ),
  oauthApprove: (b: { clientId: string; redirectUri: string; codeChallenge: string; state: string; orgId: string; scope: Scope; expiresInDays: number }) =>
    request<{ redirect: string }>('POST', '/api/oauth/approve', b),
  oauthDeny: (b: { clientId: string; redirectUri: string; state: string }) => request<{ redirect: string }>('POST', '/api/oauth/deny', b),
};
