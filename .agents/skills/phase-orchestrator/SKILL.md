---
name: phase-orchestrator
description: Autonomous task handoff and sequential phase execution protocol for Leethe subagents.
---

# Phase Orchestrator Skill

This skill governs autonomous, multi-phase agent execution loops for the **Leethe Platform**.

## Core Rules & Execution Flow

1. **Read Handoff Context**:
   - Parse `ITERATION_LOG.md` for the `NEXT TASK SPECIFICATION` block.
   - Extract `Target Objective`, `Target Files`, `Required Skills`, and `Expected Output & Verification`.

2. **Adversarial Implementation**:
   - Inspect existing authoritative source files before writing code.
   - Enforce Go as mandatory backend language and Vanilla CSS for UI primitives.
   - Zero AI integrations, zero prebuilt UI component libraries.

3. **Empirical Verification Gate**:
   - Execute verification tests (`make e2e`, `make bench`, `bash scripts/build-binaries.sh`, browser/HTTP server visual checks).
   - Gather concrete runtime proof before marking any phase complete.

4. **Handoff Generation**:
   - Update `SCOPE.md` phase status table to 🟢 Completed.
   - Append completed iteration details and next task specification to `ITERATION_LOG.md`.
   - Output structured 4-part handoff report to trigger the next subagent task.
