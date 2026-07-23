---
name: leethe-vcs-engine
description: |
  Architecture & implementation guide for Leethe's native VCS engine (Smart HTTP/SSH Git server,
  repository storage, branch management, commit diffing, and PR code reviews).
---

# Leethe VCS Engine Architecture

## Key Requirements
1. **Git Protocol Handlers**:
   - Smart HTTP Git server handling `git-upload-pack` and `git-receive-pack`.
   - SSH Git server mapping SSH public keys to Leethe user accounts.
2. **Atomic Event Trigger**:
   - Every `git-receive-pack` push atomically emits a build event to the `compute-engine`.
3. **Diff Generator**:
   - Server-side unified and side-by-side diff generator with line-by-line syntax highlighting metadata.
