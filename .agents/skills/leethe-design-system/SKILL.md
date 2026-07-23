---
name: leethe-design-system
description: |
  Guides development of bespoke Vanilla CSS components and design tokens for Leethe.
  Enforces zero prebuilt UI component libraries (no Shadcn, MUI, Tailwind). Focuses on
  Vercel/Linear/Railway/GitHub inspired aesthetics, accessibility, and visual runtime verification.
---

# Leethe Bespoke Design System Instructions

## Core Principles
1. **Zero Component Libraries**: All UI components must be created using Vanilla CSS, CSS Variables, and modern web features (CSS `:has()`, Container Queries, View Transitions API).
2. **Visual Standards**:
   - **Background**: Deep obsidian (`#000000` / `#050505`).
   - **Borders**: 1px micro-borders (`rgba(255, 255, 255, 0.08)` to `0.12`).
   - **Typography**: Inter / system monospace for code, high contrast ratios ($> 7:1$ for body text).
   - **Focus Rings**: Distinct, high-contrast outlines for `:focus-visible` to support keyboard navigation.
3. **Verification Requirement**:
   - Every component must be visually verified in the browser for `hover`, `active`, `focus-visible`, `disabled`, and contrast before marking complete.
