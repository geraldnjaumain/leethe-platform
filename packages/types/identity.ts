/**
 * Leethe Platform Identity & Permission Types
 */

export type MemberRole = 'owner' | 'admin' | 'developer' | 'viewer';

export type PermissionAction =
  | 'repo:create'
  | 'repo:delete'
  | 'repo:push'
  | 'pr:review'
  | 'pr:merge'
  | 'deploy:trigger'
  | 'deploy:rollback'
  | 'env:manage'
  | 'org:manage'
  | 'billing:access';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  orgId: string;
  name: string;
  slug: string;
}

export interface Session {
  id: string;
  userId: string;
  orgId: string;
  role: MemberRole;
  expiresAt: string;
}

export interface AuthContext {
  user: User;
  session: Session;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}
