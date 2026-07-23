import { AuthContext, MemberRole, PermissionAction, PermissionResult } from '../../../packages/types/identity';

/**
 * Role Permission Matrix defining allowed actions per organization role.
 */
const ROLE_PERMISSIONS: Record<MemberRole, Set<PermissionAction>> = {
  owner: new Set([
    'repo:create',
    'repo:delete',
    'repo:push',
    'pr:review',
    'pr:merge',
    'deploy:trigger',
    'deploy:rollback',
    'env:manage',
    'org:manage',
    'billing:access',
  ]),
  admin: new Set([
    'repo:create',
    'repo:push',
    'pr:review',
    'pr:merge',
    'deploy:trigger',
    'deploy:rollback',
    'env:manage',
    'org:manage',
  ]),
  developer: new Set([
    'repo:create',
    'repo:push',
    'pr:review',
    'pr:merge',
    'deploy:trigger',
    'deploy:rollback',
  ]),
  viewer: new Set([
    'pr:review',
  ]),
};

/**
 * Pure, deterministic Fine-Grained Access Control (FGAC) Policy Evaluator.
 * 
 * Performs O(1) role permission lookups and attribute-based checks.
 */
export function evaluatePermission(
  context: AuthContext,
  action: PermissionAction,
  targetEnv: 'development' | 'preview' | 'production' = 'development'
): PermissionResult {
  const { session } = context;

  // 1. Check Session Expiration
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    return { allowed: false, reason: 'Session expired' };
  }

  // 2. Base Role Permission Check
  const roleActions = ROLE_PERMISSIONS[session.role];
  if (!roleActions || !roleActions.has(action)) {
    return {
      allowed: false,
      reason: `Role '${session.role}' is not granted action '${action}'`,
    };
  }

  // 3. Attribute-Based Environment Boundaries (ABAC)
  // Only Admin or Owner can rollback or delete in Production
  if (targetEnv === 'production') {
    if ((action === 'deploy:rollback' || action === 'repo:delete') && session.role === 'developer') {
      return {
        allowed: false,
        reason: `Action '${action}' in production environment requires Admin or Owner role`,
      };
    }
  }

  return { allowed: true };
}
