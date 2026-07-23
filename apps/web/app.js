import { CommandPalette } from './command-palette.js';

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
      },
      {
        title: 'Manage Environment Variables',
        icon: '🔑',
        action: () => alert('Navigating to Environment Settings...')
      }
    ]
  });

  // Bind Header Button trigger
  const cmdTriggerBtn = document.getElementById('cmd-palette-trigger');
  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener('click', () => palette.open());
  }
});
