---
name: codex
description: Enables Claude Code to invoke the Codex CLI (`codex exec` and session resumes) for automated code analysis, refactoring, and editing workflows. Use when the user asks to use Codex to analyze, refactor, edit, or review code. Triggers on phrases like "use Codex to...", "run Codex on...", "analyze this with Codex", "refactor this with Codex".
---

# Codex Integration

Delegates code analysis, refactoring, and editing tasks to the Codex CLI.

## Prerequisites

Verify Codex is installed and on PATH:

```bash
codex --version
```

If not found, instruct the user to install the Codex CLI and ensure it is on their PATH.

## Workflow

### 1. Discover Current Model

Before asking the user, check what model is currently configured:

```bash
cat ~/.codex/config.toml 2>/dev/null || echo "No config found"
```

Models change with each Codex update — never hardcode them.

### 2. Always Ask the User via AskUserQuestion Tool

**Always use the `AskUserQuestion` tool — no exceptions. Ask both questions in one call:**

- **Question 1** — "Which model should I use?" (header: "Model")
  - Option 1: `[model from config] (current)` — "Your configured default"
  - Option 2: any other model visible in config migrations/history
  - Always include Other so the user can type a custom model name

- **Question 2** — "What reasoning effort (thinking) should Codex use?" (header: "Thinking")
  - Option 1: `medium` — "Balanced — your current default" (if medium is configured)
  - Option 2: `low` — "Quick, surface-level analysis"
  - Option 3: `high` — "Deep, thorough — slower but more detailed"

Wait for the user's answers before proceeding.

### 3. Build the Command

```bash
codex exec -m [model] -c model_reasoning_effort=[effort] -s [sandbox] "[prompt]"
```

**Sandbox values:**
- `read-only` — analysis only, no file writes (default)
- `workspace-write` — can write files in the project
- `danger-full-access` — no restrictions (always confirm with user before using)

**Examples:**

```bash
# Analyze a file
codex exec -m o3 -c model_reasoning_effort=medium -s read-only "Analyze src/App.tsx for bugs and code quality issues"

# Refactor with file writes
codex exec -m o4-mini -c model_reasoning_effort=high -s workspace-write "Refactor the auth module to use async/await"
```

### 4. Execute and Relay Output

- Run via Bash, suppress stderr by default (`2>/dev/null`)
- If user wants debug/thinking output, remove stderr suppression
- Relay Codex output verbatim — do not paraphrase
- If Codex suggests file changes, confirm with user before applying

### 5. Session Resumption

```bash
codex exec resume --last
# or by session ID:
codex exec resume [session-id]
```

Trigger when user says "continue", "resume", or "follow up on the last session".

## Common Issues

| Problem | Fix |
|---------|-----|
| `command not found: codex` | Install Codex CLI, add to PATH |
| Auth error | Run `codex login` |
| Unknown model | Check latest Codex docs or `~/.codex/config.toml` for current model names |
| Sandbox permission denied | Switch to `workspace-write` or `danger-full-access` (confirm with user first) |
