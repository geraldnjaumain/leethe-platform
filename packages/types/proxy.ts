/**
 * Leethe Edge Proxy & Rollback Types
 */

export interface UpstreamTarget {
  deploymentId: string;
  host: string;
  port: number;
  weight: number;
  isHealthy: boolean;
}

export interface ProxyRouteMap {
  domain: string;
  activeDeploymentId: string;
  upstreams: Record<string, UpstreamTarget>;
  updatedAt: string;
}

export interface RollbackRecord {
  id: string;
  domain: string;
  previousDeploymentId: string;
  targetDeploymentId: string;
  latencyMs: number;
  executedBy: string;
  timestamp: string;
}

export interface PreviewEnvironment {
  id: string;
  prNumber: number;
  branch: string;
  previewUrl: string;
  deploymentId: string;
  activeTarget: UpstreamTarget;
  createdAt: string;
}
