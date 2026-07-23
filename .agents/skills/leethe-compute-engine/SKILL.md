---
name: leethe-compute-engine
description: |
  Architecture & implementation guide for Leethe's Compute Engine (Nixpacks auto-builders,
  BuildKit runner, Caddy/Pingora dynamic proxy router, WebSocket log streaming, and instant rollbacks).
---

# Leethe Compute Engine Standards

## Architecture & Workflow
1. **Nixpacks Integration**:
   - Analyzes pushed source code directory to automatically select language runtime (Node, Go, Python, Rust, Dockerfile).
2. **Dynamic Proxy Routing**:
   - Dynamic API route updates via Caddy / Pingora without restarting proxy processes.
3. **Instant Zero-Downtime Rollbacks**:
   - Swapping proxy upstream endpoints to previous deployment hashes in `<10ms` with zero dropped requests.
4. **Real-time Log Pipeline**:
   - Stream stdout/stderr from build and runtime containers over WebSockets/SSE.
