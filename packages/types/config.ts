export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  idleTimeoutMs: number;
}

export interface SecurityConfig {
  jwtSecret: string;
  sessionDomain: string;
  passkeyRPID: string;
  tokenExpirySeconds: number;
}

export interface PlatformConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  database: DatabaseConfig;
  security: SecurityConfig;
}
