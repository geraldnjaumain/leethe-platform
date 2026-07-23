/**
 * Leethe Compute Engine & Deployment Types
 */

export type DeploymentState = 'queued' | 'building' | 'deploying' | 'ready' | 'failed' | 'rolled_back';

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface NixpacksPlan {
  provider: 'node' | 'go' | 'python' | 'rust' | 'dockerfile' | 'generic';
  installCommand?: string;
  buildCommand?: string;
  startCommand: string;
  environmentVars: Record<string, string>;
}

export interface Deployment {
  id: string;
  repoId: string;
  commitSha: string;
  branch: string;
  targetEnv: 'development' | 'preview' | 'production';
  state: DeploymentState;
  previewUrl?: string;
  nixpacksPlan: NixpacksPlan;
  createdAt: string;
  finishedAt?: string;
}

export interface LogStreamChunk {
  deploymentId: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  phase: 'setup' | 'nixpacks' | 'build' | 'deploy' | 'runtime';
}
