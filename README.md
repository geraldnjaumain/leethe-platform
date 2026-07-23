# Leethe Developer Platform

> **An AI-Free, Developer-First Platform Combining GitHub VCS & Vercel/Railway Compute**

**`leethe`** is an open, high-performance developer platform designed to unify Git repository hosting and code collaboration with instant container builds, preview deployments, and zero-downtime hosting—without the clutter of AI chatbots, forced LLM widgets, or third-party webhook dependencies.

---

## Key Pillars & Differentiators

* **AI-Free & Sub-50ms UX**: Clean, deterministic, keyboard-first interface (`Cmd+K` command palette) built with zero AI bloat.
* **Native VCS + Compute Integration**: Pushing code updates the repository and triggers instant Nixpacks container builds in the same atomic event lifecycle.
* **Instant Zero-Downtime Rollbacks (<10ms)**: Atomic target switching via Pingora/Caddy dynamic proxies allows 1-click rollbacks in **<10ms** without dropping active connections.
* **Bespoke Design System**: Built with **100% Vanilla CSS** (no Tailwind, Shadcn, or MUI). Deep obsidian dark mode (`#000000`), micro-borders (`1px solid rgba(255,255,255,0.08)`), and high-contrast typography inspired by Vercel and Linear.
* **6 Bounded Context Services**: Modular monolith architecture designed to scale across teams without premature microservice over-fragmentation.

---

## Monorepo Architecture

```text
leethe/
├── .agents/                   # Governance, Anti-Hallucination Guardrails & 13 Skills
├── apps/
│   ├── web/                   # Web Application, UI Verification Harness & Command Palette
│   └── cli/                   # Single-Binary Go CLI (`leethe` binary)
│
├── services/                  # Core Bounded Context Engine Services
│   ├── identity/              # Auth, Passkeys, Session Tokens, FGAC Policy Evaluator
│   ├── vcs-engine/            # Git HTTP/SSH Server, Repo Storage, Streaming Patch Parser
│   ├── compute-engine/        # Nixpacks Auto-Builder, BuildKit Container Runner
│   └── edge-proxy/            # Dynamic Proxy Router & <10ms Zero-Downtime Rollback Engine
│
└── packages/
    ├── design-system/         # Bespoke Vanilla CSS Tokens, Buttons, Badges, Cards, Inputs, Diff Viewer, Log Terminal
    └── types/                 # Shared TypeScript interfaces (Identity, VCS, Compute, Proxy)
```

---

## Quickstart & Verification Harness

### 1. View Web Dashboard & Interactive Harness
Serve the web verification harness locally:
```bash
make dev
# or: python3 -m http.server 8080 --directory apps/web
```
Open `http://localhost:8080` in your browser to inspect:
* **Bespoke UI Primitives**: Buttons, status badges, micro-bordered cards, form controls.
* **Command Palette**: Press `Cmd+K` or `Ctrl+K` to toggle overlay.
* **Native Code Diff Viewer**: Unified and Side-by-Side code diffing.
* **Live Log Terminal**: Real-time Nixpacks build streaming and log output.
* **Rollback Controller**: 1-click deployment target switching (<10ms latency).

### 2. Run CLI Command Prototype
```bash
make build-cli
# or: go run apps/cli/main.go --help
```

### 3. Production Self-Hosting with Docker Compose
To launch the complete Leethe platform stack (Caddy Proxy, Identity, VCS, Compute, Postgres, Redis):
```bash
make docker-up
# or: cd infrastructure/docker && docker compose up -d
```
Access points:
* **Web Dashboard & Gateway**: `http://localhost:80`
* **Git SSH Server**: `ssh://git@localhost:2222`
* **Wildcard Preview Deployments**: `http://*.leethe.dev`

---

## Architecture Specifications

* [`AGENTS.md`](file:///Users/tera/Documents/leethe/.agents/AGENTS.md) — Adversarial Code Reviewer Protocol, Visual Verification Standards, and Anti-Hallucination Rules.
* [`SCOPE.md`](file:///Users/tera/Documents/leethe/SCOPE.md) — Feature boundaries, project milestones, and non-goals.
* [`ITERATION_LOG.md`](file:///Users/tera/Documents/leethe/ITERATION_LOG.md) — Step-by-step iteration handoffs and empirical test results.
