import { CommandPalette } from './command-palette.js';
import { DiffViewer } from './diff-viewer.js';
import { LogTerminal } from './log-terminal.js';
import { RollbackController } from './rollback-controller.js';
import { renderDiagnosticsDashboard } from './diagnostics.js';
import { renderServiceTopology } from './topology.js';
import { LogWebSocketClient } from './ws-client.js';
import { parseGitDiff } from '../../services/vcs-engine/domain/diff-parser.ts';
import { generateNixpacksPlan } from '../../services/compute-engine/domain/nixpacks-builder.ts';
import { handleLogStreamConnection } from '../../services/compute-engine/handlers/ws-logs.ts';

// Sample Unified Git Patch
const SAMPLE_GIT_PATCH = `diff --git a/services/identity/permissions.ts b/services/identity/permissions.ts
@@ -10,4 +10,6 @@ export function evaluatePermission(role: string, action: string) {
-  if (role === 'guest') return false;
+  if (role === 'viewer') return action === 'pr:review';
+  if (role === 'developer') return true;
+  if (role === 'admin') return true;
   return false;
 }`;

// Leethe Web Verification Harness Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
  const primaryBtn = document.getElementById('btn-primary');
  const badgeSuccess = document.getElementById('badge-success');

  if (primaryBtn && badgeSuccess) {
    primaryBtn.addEventListener('click', () => {
      const currentText = badgeSuccess.textContent.trim();
      if (currentText.includes('Deployed')) {
        badgeSuccess.className = 'leethe-badge leethe-badge-warning';
        badgeSuccess.innerHTML = 'Re-deploying...';
      } else {
        badgeSuccess.className = 'leethe-badge leethe-badge-success';
        badgeSuccess.innerHTML = 'Deployed';
      }
    });
  }

  // Initialize Bespoke Cmd+K Command Palette
  const palette = new CommandPalette({
    commands: [
      {
        title: 'Create New Repository',
        icon: '📁',
        shortcut: 'N',
        action: () => alert('Action: Create Repository triggered')
      },
      {
        title: 'Trigger Production Deployment',
        icon: '🚀',
        shortcut: 'D',
        action: () => alert('Action: Deployment Triggered')
      },
      {
        title: 'Instant Rollback (Previous SHA)',
        icon: '↩️',
        shortcut: 'R',
        action: () => alert('Action: Rollback Initiated')
      },
      {
        title: 'View VCS Commits & Diffs',
        icon: '🔀',
        action: () => alert('Navigating to Code Diffs...')
      }
    ]
  });

  const cmdTriggerBtn = document.getElementById('cmd-palette-trigger');
  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener('click', () => palette.open());
  }

  // Initialize Native Code Diff Viewer
  const diffFiles = parseGitDiff(SAMPLE_GIT_PATCH);
  new DiffViewer('#diff-viewer-root', {
    files: diffFiles,
    mode: 'unified'
  });

  // Initialize Live Log Terminal & WebSocket Client Manager
  const terminal = new LogTerminal('#log-terminal-root');
  const wsBadge = document.getElementById('ws-status-badge');

  const wsClient = new LogWebSocketClient({
    url: 'ws://localhost:8080/logs',
    onLog: (chunk) => terminal.appendLog(chunk),
    onStatusChange: (status) => {
      if (wsBadge) {
        if (status === 'connected') {
          wsBadge.className = 'leethe-badge leethe-badge-success';
          wsBadge.innerHTML = 'WS: Connected';
        } else {
          wsBadge.className = 'leethe-badge leethe-badge-warning';
          wsBadge.innerHTML = `WS: ${status}`;
        }
      }
    }
  });

  wsClient.connect();

  // Simulate Real-time Log Stream Connection
  const mockSocket = {
    send: (data) => {
      const chunk = JSON.parse(data);
      wsClient.receiveChunk(chunk);
    },
    close: () => wsClient.close()
  };

  handleLogStreamConnection(mockSocket, 'dep_8a2f10b');

  // Initialize Instant Zero-Downtime Rollback Controller
  const mockRouteMap = {
    domain: 'leethe-platform.leethe.app',
    activeDeploymentId: 'dep_8a2f10b',
    updatedAt: new Date().toISOString(),
    upstreams: {
      'dep_8a2f10b': { deploymentId: 'dep_8a2f10b', host: '10.0.4.12', port: 3000, weight: 100, isHealthy: true },
      'dep_7f8a92a': { deploymentId: 'dep_7f8a92a', host: '10.0.4.11', port: 3000, weight: 100, isHealthy: true },
      'dep_6e7a81f': { deploymentId: 'dep_6e7a81f', host: '10.0.4.10', port: 3000, weight: 100, isHealthy: true },
    }
  };

  const mockDeployments = [
    { id: 'dep_8a2f10b', commitSha: 'e318431', createdAt: '2 minutes ago' },
    { id: 'dep_7f8a92a', commitSha: 'a1e6631', createdAt: '1 hour ago' },
    { id: 'dep_6e7a81f', commitSha: 'f1812be', createdAt: '3 hours ago' },
  ];

  new RollbackController('#rollback-controller-root', {
    routeMap: mockRouteMap,
    deployments: mockDeployments,
    onRollback: (updatedMap, record) => {
      console.log('Rollback executed cleanly:', record);
    }
  });

  // Render Go Runtime & Edge Proxy Diagnostics Component
  const diagContainer = document.getElementById('diagnostics-dashboard-root');
  if (diagContainer) {
    renderDiagnosticsDashboard(diagContainer, {
      status: 'healthy',
      uptimeSeconds: 64.8,
      numGoroutine: 4,
      memAllocMB: 1.45,
      activeRoutes: 3,
      activeTarget: 'dep_8a2f10b'
    });
  }

  // Render Service Topology Graph Component
  const topologyContainer = document.getElementById('topology-canvas-root');
  if (topologyContainer) {
    renderServiceTopology(topologyContainer);
  }
});


