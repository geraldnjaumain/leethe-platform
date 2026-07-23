import { CommandPalette } from './command-palette.js';
import { DiffViewer } from './diff-viewer.js';
import { parseGitDiff } from '../../services/vcs-engine/domain/diff-parser.ts';

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
});
