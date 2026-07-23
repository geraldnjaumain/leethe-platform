# Leethe Engineering & Architectural Governance

## 1. Adversarial Code Reviewer Protocol
Every architectural proposal, design document, snippet, or pull request must undergo adversarial review under the strict presumption that **the initial code/design is imperfect, sub-optimal, or flawed**.

### Review Rules:
1. **Default Skepticism**: Assume every proposed function, schema, or layout has hidden edge cases, performance bottlenecks, or security flaws.
2. **Optimization Benchmark**: Before approving any implementation, explicitly evaluate:
   - **Performance & Latency**: Is there unnecessary allocation, hidden network round-trip ($O(N)$ query loops), or unnecessary re-rendering?
   - **Type Safety & Edge Cases**: Are `null`/`undefined`/error states explicitly handled? Are edge inputs (empty repos, long commit SHAs, binary diffs) accounted for?
   - **Architectural Elegance**: Is this introducing redundant abstractions, tech debt, or violating single-responsibility? Can it be implemented with fewer moving parts?
3. **Actionable Counter-Proposals**: Never just reject code—always provide the precise, optimized counter-implementation.

---

## 2. Rigorous Functional & Visual Verification Policy
No feature, UI component, or API endpoint—**no matter how trivial (e.g., a primary button, badge, or modal trigger)**—is marked complete without concrete empirical verification.

### Verification Standards:
1. **Interactive/Visual Verification**:
   - UI components must be visually inspected in runtime for correct rendering, states (`hover`, `active`, `focus-visible`, `disabled`, `contrast`, `color`, `spacing`, `font`, `alignment`).
   - Micro-animations and layout shifts must be tested across container boundaries.
2. **Behavioral Testing**:
   - Interactive elements must be tested for key events (`Enter`, `Space`, `Escape`, `Tab` navigation).
   - Backend routes and handlers must be verified via test suites or direct request execution to confirm exact response payloads and HTTP status codes.
3. **No Unverified Assumptions**: Never declare code complete based solely on compilation or clean static analysis.

---

## 3. Anti-Hallucination & Zero Scope-Creep Guardrails

### Anti-Hallucination Guardrails:
1. **Never Guess Source Code or Schemas**: Do NOT guess file locations, type signatures, database schemas, or exported module APIs. Always inspect authoritative source files using viewing and search tools before writing code.
2. **Fact-Based Diagnostics**: Base all debugging strictly on empirical stack traces and runtime log lines. Do NOT attempt speculative symptom patching or comment out failing assertions.
3. **Verified Dependencies Only**: Do NOT reference or import non-existent packages, unverified standard library functions, or deprecated APIs.

### Scope Control & Boundaries:
1. **Strict Adherence to `SCOPE.md`**: Only implement features explicitly defined in `SCOPE.md`. Never add unrequested features, "speculative convenience methods", or unexpected architectural layers.
2. **AI-Free Constraint**: `leethe` is strictly an **AI-free platform**. Do NOT introduce AI chatbots, copilot widgets, LLM prompts, or unnecessary vector/embedding dependencies into `leethe`.
3. **Zero Heavy UI Libraries**: Do NOT introduce prebuilt UI component libraries (e.g., Shadcn, MUI, AntD, Tailwind). Build bespoke UI primitives using Vanilla CSS and modern browser APIs.

---

## 4. Mandatory Iteration Handoff & Next-Task Protocol

After completing EVERY iteration or task, the AI agent MUST update `ITERATION_LOG.md` and `SCOPE.md` with a detailed handoff entry containing:

1. **Current State & Progress**:
   - What was implemented and verified in this iteration.
   - Files created or modified.
   - Verification commands executed & empirical results.
2. **Scope Alignment Check**:
   - Explicit confirmation that the changes fit within the boundaries defined in `SCOPE.md`.
3. **Next Task Specification**:
   - **Target Objective**: Clear statement of the next task.
   - **Target Files**: Exact absolute/relative file paths to be created or modified next.
   - **Required Skills & Tools**: List of specific skills (e.g., `modern-web-guidance`, `leethe-design-system`, `leethe-vcs-engine`) to activate for the task.
   - **Expected Output & Verification**: Clear acceptance criteria, expected UI visual states, and test commands to run.

---

## 5. Bespoke Design System & UI Policy
- **No Heavy Component Libraries**: Do NOT install or use pre-built component libraries (e.g., Shadcn, MUI, AntD). All UI elements must be built bespoke using Vanilla CSS / Modern CSS features (CSS Variables, Container Queries, `:has()`, View Transitions API) for maximum speed and complete design ownership.
- **Aesthetic Inspiration**: Draw visual cues from premier developer interfaces:
  - **Vercel**: Deep dark mode (`#000000`), micro-borders (`1px solid rgba(255,255,255,0.1)`), high-contrast typography.
  - **Linear**: Keyboard-first design (`Cmd+K` / shortcuts), sub-50ms transitions, clean status indicators, fast table views.
  - **Railway**: Canvas/card-based service topology, real-time log terminal styling, crisp color-coded resource metrics.
  - **GitHub**: Dense, readable diff viewers, clear pull request review timelines, semantic status badges.
