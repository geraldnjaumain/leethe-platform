import { CommandPalette } from './command-palette.js';
import { DiffViewer } from './diff-viewer.js';
import { LogTerminal } from './log-terminal.js';
import { parseGitDiff } from '../../services/vcs-engine/domain/diff-parser.ts';
import { generateNixpacksPlan } from '../../services/compute-engine/domain/nixpacks-builder.ts';

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
        badgeSuccess.innerHTML = '<span class="leethe-badge-dot"></span> Re-deploying...';
      } else {
        badgeSuccess.className = 'leethe-badge leethe-badge-success';
        badgeSuccess.innerHTML = '<span class="leethe-badge-dot"></span> Deployed';
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

  // Initialize Live Log Terminal & Nixpacks Builder Stream
  const terminal = new LogTerminal('#log-terminal-root');
  
  // Nixpacks Plan Derivation
  const mockManifest = ['package.json', 'pnpm-lock.yaml', 'src/index.ts'];
  const plan = generateNixpacksPlan(mockManifest);

  const buildSteps = [
    { level: 'info', phase: 'setup', message: `Initializing Leethe Compute Engine for repo leethe-platform...` },
    { level: 'info', phase: 'nixpacks', message: `Nixpacks Provider Detected: [${plan.provider.toUpperCase()}]` },
    { level: 'info', phase: 'nixpacks', message: `Install Command: ${plan.installCommand}` },
    { level: 'info', phase: 'nixpacks', message: `Build Command: ${plan.buildCommand}` },
    { level: 'info', phase: 'nixpacks', message: `Start Command: ${plan.startCommand}` },
    { level: 'info', phase: 'build', message: `Executing pnpm install... (packages installed in 1.4s)` },
    { level: 'info', phase: 'build', message: `Building production bundle... (compiled successfully)` },
    { level: 'info', phase: 'deploy', message: `Registering dynamic Pingora proxy upstream at target 10.0.4.12:3000...` },
    { level: 'success', phase: 'deploy', message: `Deployment ready! Preview URL: https://dep-8a2f10b.leethe.dev` },
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    if (stepIdx < buildSteps.length) {
      const step = buildSteps[stepIdx];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      terminal.appendLog({
        deploymentId: 'dep_8a2f10b',
        timestamp,
        level: step.level,
        phase: step.phase,
        message: step.message
      });
      stepIdx++;
    } else {
      clearInterval(interval);
      terminal.setStatus('Ready (Live)', 'success');
    }
  }, 250);
});
