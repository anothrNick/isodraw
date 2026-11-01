import { createContext, useContext } from 'react';
import type { Org, User } from './api';

export interface Session {
  user: User;
  orgs: Org[];
  /** Lifetime access: no diagram limit in the personal workspace, and team workspaces. */
  lifetime: boolean;
  /** A platform admin, who gets the admin screens (/admin). */
  admin?: boolean;
  /** Fetch the user's organizations again, after joining or creating one. */
  reload: () => Promise<Session>;
}

export const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const s = useContext(SessionContext);
  if (!s) throw new Error('useSession outside the signed-in app');
  return s;
}

export const ROLE_NAMES = { owner: 'Owner', admin: 'Admin', editor: 'Editor', viewer: 'Viewer' } as const;

export const ROLE_HINTS = {
  owner: 'Everything, including managing other owners',
  admin: 'Edit diagrams and manage members',
  editor: 'Create and edit diagrams',
  viewer: 'Read diagrams and docs',
} as const;
