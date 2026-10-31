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
};
