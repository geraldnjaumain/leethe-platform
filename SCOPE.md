# Leethe Project Scope & Architectural Boundaries

## 1. Project Vision
**Leethe** is an **AI-free, developer-first platform** that natively merges Git repository hosting and collaboration (**GitHub functionality**) with instant container builds, preview deployments, and zero-downtime hosting (**Vercel/Railway functionality**).

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
| **Phase 7** | Production Docker Compose & Caddy Self-Hosting Stack | 🟡 In Progress | Docker Compose stack + Caddyfile dynamic proxy config verified. |
