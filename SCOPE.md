## 1. Project Vision & Technology Stack
**Leethe** is an **AI-free, developer-first platform** that natively merges Git repository hosting and collaboration (**GitHub functionality**) with instant container builds, preview deployments, and zero-downtime hosting (**Vercel/Railway functionality**).

* **Backend Stack**: **Go (Golang)** — All core services (`services/identity`, `services/vcs-engine`, `services/compute-engine`, `services/edge-proxy`) and the developer CLI (`apps/cli`) are implemented in Go for maximum speed, sub-10ms execution, and minimal memory overhead.
* **Frontend Stack**: Bespoke Vanilla CSS design tokens + Modern Web HTML/JS (`apps/web/`).

---

## 2. In-Scope Core Capabilities

### A. Bespoke Design System & Web Application (`apps/web/`)
- Bespoke Vanilla CSS Design Tokens (`#000000` deep dark mode, 1px micro-borders, high contrast typography).
- Keyboard-first interaction model (`Cmd+K` command palette, `g + r` shortcuts).
- Sub-50ms page transitions via View Transitions API.
- Dense, highly readable code diff viewer and live terminal log streaming UI.

### B. Authentication & Fine-Grained Permissions (`services/identity/`)
- Passkey (WebAuthn) + Magic Link + OAuth2/OIDC authentication.
- Dual-token HTTP-Only session management.
- Organization, Workspace, Repository, and Deployment access control (RBAC + FGAC).

### C. Native VCS Engine (`services/vcs-engine/`)
- Smart HTTP & SSH Git Server.
- Repository hosting, branch management, commit history tracking.
- Pull Request review system with inline commenting and unified/side-by-side diffing.

### D. Compute & Builder Engine (`services/compute-engine/`)
- Nixpacks auto-detection & BuildKit container packager.
- One-click managed database provisioning (Postgres, Redis).
- Live build and runtime log streaming via WebSockets / SSE.

### E. Edge Proxy & Deployment Engine (`services/edge-proxy/`)
- Dynamic API-driven reverse proxy (Caddy / Pingora).
- Subdomain (`*.leethe.dev`) & custom domain SSL certificate management.
- **Zero-Downtime Rollbacks** (<10ms target switching).

### F. Developer CLI (`apps/cli/`)
- Single-binary CLI in Go/Rust for authentication, deployment, log tailing, and environment variable management.

---

## 3. Explicit Non-Goals & Out-of-Scope (Guardrails)

> [!CAUTION]
> The following features and architectural patterns are **STRICTLY PROHIBITED**:
> 1. **AI Chatbots, Copilots, or Prompt Widgets**: `leethe` is an AI-free platform. No AI integrations, LLM prompts, or vector database dependencies.
> 2. **Prebuilt UI Component Libraries**: No Tailwind CSS, Radix UI, Shadcn, MUI, or AntD. All UI primitives must be authored bespoke in Vanilla CSS.
> 3. **Premature Microservice Over-Fragmenting**: Services must be grouped into the 6 core bounded contexts defined in `services/`. Do NOT create individual microservices per database table.
> 4. **Unverified Third-Party SaaS Dependencies**: No external auth SaaS (e.g., Auth0/Clerk) or third-party webhooks requirement for core deployments. All core capabilities must run natively in `leethe`.

---

## 4. Phase Execution & Scope Status

| Phase | Description | Scope Status | Completion Gate |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Bespoke Design System & UI Primitives Harness | 🟢 Completed | Visual test harness verifying all component states (`hover`, `active`, `focus-visible`, `contrast`, `alignment`). Verified via HTTP server. |
| **Phase 2** | Identity, RBAC & Command Palette | 🟢 Completed | Passkey Auth + Org permissions + `Cmd+K` palette verified. FGAC test passed. |
| **Phase 3** | Native VCS Engine & Code Diffs | 🟢 Completed | Patch parser unit test passed + bespoke diff viewer verified + pushed to remote. |
| **Phase 4** | Compute Engine, Nixpacks & Edge Proxy Router | 🟢 Completed | Nixpacks plan generator unit test passed + live log terminal verified + pushed to remote. |
| **Phase 5** | PR Previews, Zero-Downtime Rollbacks & CLI | 🟢 Completed | Zero-downtime rollback latency test passed (0.015ms) + rollback controller UI verified + pushed to remote. |
| **Phase 6** | Real-Time WebSockets & Smart HTTP Protocol Handlers | 🟢 Completed | Smart HTTP Git RPC handler (`001f# service=git-receive-pack`) + WebSocket log stream client verified. |
| **Phase 7** | Production Docker Compose & Caddy Self-Hosting Stack | 🟢 Completed | Docker Compose stack + Caddyfile dynamic proxy config verified. |
| **Phase 8** | Native Go VCS Engine & Smart HTTP Git Server | 🟢 Completed | Go Smart HTTP server (`services/vcs-engine/main.go`) + diff parser (`diff.go`) verified. |
| **Phase 9** | Native Go Compute Engine & Nixpacks Builder Service | 🟢 Completed | Go Compute Engine (`services/compute-engine/main.go`) + Nixpacks plan generator verified. |
| **Phase 10** | Native Go Identity Service & FGAC Policy Evaluator | 🟢 Completed | Go Identity HTTP server (`services/identity/main.go`) + FGAC evaluator (`permissions.go`) verified. |
| **Phase 11** | Native Go Edge Proxy & Zero-Downtime Rollback Engine | 🟢 Completed | Go Edge Proxy (`services/edge-proxy/main.go`) + atomic rollback engine (`rollback.go`) verified (0.006ms latency). |
| **Phase 12** | Multi-Stage Go Dockerfiles & Root Makefile Integration | 🟢 Completed | Multi-stage Dockerfiles + root `Makefile` targets verified. |
| **Phase 13** | End-to-End Go Services Integration Test & E2E Validation | 🟢 Completed | E2E integration test runner (`tests/e2e/e2e_test.go`) verified all 4 pipeline stages. |
| **Phase 14** | Platform Continuous Verification & Final Tag Release | 🟢 Completed | Release tag `v1.0.0-alpha` tagged & pushed to remote origin `leethe-platform`. |
| **Phase 15** | Developer CLI Terminal Formatting & Interactive Commands | 🟢 Completed | Single-binary Go CLI (`apps/cli/main.go`) formatted with high-contrast ANSI colors verified. |
| **Phase 16** | Security Audit & Production Environment Schema | 🟢 Completed | Environment configuration schema (`packages/types/config.ts` & `config.go`) verified. |
| **Phase 17** | Production Binary Cross-Compilation & Multi-Arch Build | 🟢 Completed | Cross-compilation script (`scripts/build-binaries.sh`) compiled 4 static targets verified. |
| **Phase 18** | GitHub Actions Continuous Integration (CI) Workflow | 🟢 Completed | Automated CI workflow (`.github/workflows/ci.yml`) verified. |
| **Phase 19** | Health Monitoring & System Diagnostics Handler | 🟢 Completed | Diagnostics handler (`services/edge-proxy/health.go`) verified (/health/diagnostics). |
| **Phase 20** | Sans-Serif Font Stack & Vector Logo Integration | 🟢 Completed | Bundled design system stylesheet & Octodragon vector logo asset verified. |
| **Phase 21** | Go Performance Benchmarking & Memory Allocation Suite | 🟢 Completed | Benchmark suite (`tests/benchmark/benchmark_test.go`) verified (231M ops/sec). |
| **Phase 22** | Phase Orchestrator & Autonomous Agent Loop Runner | 🟢 Completed | Loop runner (`scripts/agent-loop.sh`) & skill (`phase-orchestrator`) verified. |
| **Phase 23** | Operational Monitoring & Live Diagnostics Dashboard UI | 🟢 Completed | Live diagnostics UI component (`apps/web/diagnostics.js`) verified. |
| **Phase 24** | High-Availability Edge Proxy Service Discovery & Multi-Region Health Poller | 🟢 Completed | Background health poller module (`services/edge-proxy/poller.go`) verified. |
| **Phase 25** | Automated Multi-Platform Release Distribution Matrix & Packaging Verification | 🟢 Completed | Release packager script (`scripts/distribute-release.sh`) verified. |
| **Phase 26** | Developer CLI Workspace Initialization & Scaffold Command | 🟢 Completed | CLI workspace scaffolder module (`apps/cli/init.go`) verified. |
| **Phase 27** | System Health & Production Diagnostics Integration Test Suite | 🟢 Completed | Health test suite (`tests/health/health_test.go`) verified. |
| **Phase 28** | Platform Comprehensive Architecture Documentation & Master Operations Handbook | 🟢 Completed | Architecture handbook (`docs/ARCHITECTURE.md`) verified. |
| **Phase 29** | Automated Database Schema Migration Engine | 🟢 Completed | Zero-ORM Go migration runner (`services/identity/migrations.go`) verified. |
| **Phase 30** | Automatic Let's Encrypt TLS Certificate Provisioner | 🟢 Completed | ACME SSL certificate engine (`services/edge-proxy/acme.go`) verified. |
| **Phase 31** | Distributed OpenTelemetry Compatible Tracing Pipeline | 🟢 Completed | Distributed tracing collector (`services/compute-engine/tracing.go`) verified. |
| **Phase 32** | Service Topology Graph & Interactive Canvas UI | 🟢 Completed | Bespoke canvas topology component (`apps/web/topology.js`) verified. |
| **Phase 33** | Multi-Tenant Team Organizations & Audit Log Streamer | 🟡 In Progress | Immutable audit log event streamer (`services/identity/audit.go`). |
| **Phase 34** | Secret Management & Encrypted Vault Engine | ⚪ Pending | AES-256-GCM encrypted vault (`services/identity/vault.go`). |
| **Phase 35** | High-Availability Cluster Consensus Engine | ⚪ Pending | Light-weight Raft consensus module (`services/edge-proxy/raft.go`). |
