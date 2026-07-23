import { ProxyRouteMap, RollbackRecord } from '../../../packages/types/proxy';

export interface RollbackResult {
  updatedMap: ProxyRouteMap;
  record: RollbackRecord;
  latencyMs: number;
}

/**
 * Pure Functional Zero-Downtime Rollback Target Switcher.
 * 
 * Performs atomic in-memory target switching in <10ms without dropping active connections.
 */
export function executeRollback(
  currentMap: ProxyRouteMap,
  targetDeploymentId: string,
  executedBy: string = 'user'
): RollbackResult {
  const startTime = performance.now();

  // 1. Target Validation
  const targetUpstream = currentMap.upstreams[targetDeploymentId];
  if (!targetUpstream) {
    throw new Error(`Target deployment '${targetDeploymentId}' not found in route upstreams`);
  }

  if (!targetUpstream.isHealthy) {
    throw new Error(`Cannot rollback to target deployment '${targetDeploymentId}': Upstream is unhealthy`);
  }

  const previousDeploymentId = currentMap.activeDeploymentId;
  const timestamp = new Date().toISOString();

  // 2. Atomic In-Memory Target Switch
  const updatedMap: ProxyRouteMap = {
    ...currentMap,
    activeDeploymentId: targetDeploymentId,
    updatedAt: timestamp,
  };

  const endTime = performance.now();
  const latencyMs = parseFloat((endTime - startTime).toFixed(3));

  const record: RollbackRecord = {
    id: `rb_${Math.random().toString(36).substring(2, 9)}`,
    domain: currentMap.domain,
    previousDeploymentId,
    targetDeploymentId,
    latencyMs,
    executedBy,
    timestamp,
  };

  return {
    updatedMap,
    record,
    latencyMs,
  };
}
