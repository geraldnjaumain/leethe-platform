#!/usr/bin/env bash
set -euo pipefail

COMMAND="${1:-status}"

echo "🤖 Leethe Autonomous Agent Phase Orchestrator"
echo "============================================="

if [ "$COMMAND" = "status" ]; then
  echo "📊 Reading Phase Matrix from SCOPE.md..."
  grep -E "Phase [0-9]+" SCOPE.md | head -n 30
  echo ""
  echo "📋 Latest Iteration Log Handoff:"
  tail -n 25 ITERATION_LOG.md
  exit 0
fi

if [ "$COMMAND" = "next" ]; then
  echo "🚀 Extracting Next Task Specification from ITERATION_LOG.md..."
  grep -A 15 "NEXT TASK SPECIFICATION" ITERATION_LOG.md
  echo ""
  echo "✅ Handoff Context Ready for Next Agent Invocation."
  exit 0
fi

echo "Usage: bash scripts/agent-loop.sh [status|next]"
