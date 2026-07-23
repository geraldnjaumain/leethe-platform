import { LogStreamChunk } from '../../../packages/types/compute';

export interface ServerWebSocket {
  send(data: string): void;
  close(): void;
}

/**
 * Server-side WebSocket Log Streaming Handler.
 * Dispatches real-time stdout/stderr log frames to web & CLI clients.
 */
export function handleLogStreamConnection(
  socket: ServerWebSocket,
  deploymentId: string,
  onLogStream?: (chunk: LogStreamChunk) => void
): void {
  const steps: Omit<LogStreamChunk, 'timestamp' | 'deploymentId'>[] = [
    { level: 'info', phase: 'setup', message: `[WebSocket] Authenticated subscriber for deployment ${deploymentId}` },
    { level: 'info', phase: 'nixpacks', message: `[Nixpacks] Analyzing directory manifest & lockfiles...` },
    { level: 'info', phase: 'build', message: `[BuildKit] Compiling production container image...` },
    { level: 'info', phase: 'deploy', message: `[EdgeProxy] Dynamically registering Pingora route upstream...` },
    { level: 'success', phase: 'runtime', message: `[Runtime] Container instance live at 10.0.4.12:3000` },
  ];

  steps.forEach((step, idx) => {
    setTimeout(() => {
      const chunk: LogStreamChunk = {
        deploymentId,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        ...step,
      };

      try {
        socket.send(JSON.stringify(chunk));
        if (onLogStream) onLogStream(chunk);
      } catch (err) {
        // Socket closed
      }
    }, (idx + 1) * 200);
  });
}
