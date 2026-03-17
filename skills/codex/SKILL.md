---
name: codex
description: >
  Enables Claude Code to invoke the Codex CLI (`codex exec` and session resumes) for automated
  code analysis, refactoring, and editing workflows. Triggers on any request to use Codex —
  "use Codex to...", "run Codex on...", "analyze with Codex", "have Codex look at...",
  "let Codex handle...", "Codex review...", "send this to Codex", etc.
---

# Codex Integration

Delegates code analysis, refactoring, and editing tasks to the Codex CLI from within Claude Code.

## Prerequisites

Verify Codex is installed and usable:

```bash
codex --version 2>&1 || echo "CODEX_NOT_FOUND"
```

- If `CODEX_NOT_FOUND` → tell the user to install Codex CLI (`npm i -g @openai/codex`) and add it to PATH.
- Store the version string for later reference (flag compatibility).

## Workflow

### 1. Discover Current Model

Parse the configured model — don't just dump the file:

```bash
grep -E '^model\s*=' ~/.codex/config.toml 2>/dev/null | head -1 | sed 's/.*"\(.*\)"/\1/'
```

- If the file is missing or the grep returns nothing → tell the user: "No Codex config found. Run `codex` once to generate `~/.codex/config.toml`, or tell me which model to use."
- Never hardcode model names. Models change with each Codex update.

### 2. Ask the User via AskUserQuestion

Use the `AskUserQuestion` tool **twice in sequence** (one question per call):

**Call 1 — Model selection:**
- Title: "Which model should Codex use?"
- Option 1: `{discovered_model} (current)` — "Your configured default"
- Option 2: any alternative model found in config history
- Always include **Other** so the user can type a custom model name

**Call 2 — Reasoning effort:**
- Title: "What reasoning effort?"
- Option 1: `medium` — "Balanced — fast and accurate (default)"
- Option 2: `low` — "Quick, surface-level — fastest"
- Option 3: `high` — "Deep, thorough — slowest, use only for complex audits"

**Default is `medium`.** Only suggest `high` if the task is explicitly a deep audit or full codebase analysis.

Wait for both answers before proceeding.

### 3. Determine Sandbox Mode

Use this explicit mapping — do NOT guess:

| Task keywords | Sandbox | Confirm? |
|---|---|---|
| analyze, review, check, audit, explain, read, inspect, compare | `read-only` | No |
| refactor, edit, write, fix, update, rename, move, add, create | `workspace-write` | No |
| install, deploy, run, execute, delete, rm, drop, full access | `danger-full-access` | **Always confirm** |

If ambiguous, default to `read-only` and tell the user: "I'm using read-only sandbox. Say 'allow writes' if Codex needs to modify files."

**Convenience alias:** For write tasks, `--full-auto` is equivalent to `-a on-request -s workspace-write` and reduces friction:

```bash
codex exec -m {model} -c model_reasoning_effort={effort} --full-auto "{prompt}"
```

### 4. Build the Command

```bash
codex exec \
  -m {model} \
  -c model_reasoning_effort={effort} \
  -s {sandbox} \
  "{prompt}"
```

**Prompt enrichment** — Before passing the user's raw request, prepend project context AND speed constraints:

```
Project: {repo_name} ({git_branch})
Working directory: {cwd}
Files in scope: {list only the relevant files, not the whole repo}
---
IMPORTANT: Work only with the local files listed above. Do not search the web unless the task explicitly requires it.
---
{user's original request}
```

**Scope discipline — keep Codex focused:**
- Only list files directly relevant to the task — not `git ls-files` of the whole repo
- For audits of 1-3 files: pass those file paths explicitly
- For broad tasks: pass the directory, not every file
- Never ask Codex to "read everything" — it will, and it's slow

### 5. Execute and Handle Output

Run via Bash **with stderr captured** and a **5-minute hard timeout**:

```bash
codex exec -m {model} -c model_reasoning_effort={effort} -s {sandbox} "{prompt}" 2>&1
```

Set Bash `timeout` parameter to `300000` (5 min). If it times out, offer to re-run with `low` effort or a narrower scope.

**Useful output flags:**

| Flag | When to use |
|---|---|
| `--json` | Structured JSONL output — use when you need to parse or save results |
| `--output-last-message <file>` | Write Codex's final answer to a file — good for long audits |
| `--ephemeral` | No session files written — use for one-shot tasks you don't need to resume |

**Error handling — check exit code:**

| Error pattern | Diagnosis |
|---|---|
| `command not found` | Codex CLI not installed or not on PATH |
| `auth` / `token` / `401` / `403` | Run `codex login` to re-authenticate |
| `unknown model` / `invalid model` | Model name is wrong — re-check config or ask user |
| `permission` / `sandbox` | Sandbox too restrictive — offer to escalate |
| `timeout` | Codex took too long — suggest reducing scope or lowering effort |

**Output size guard:**
- If output exceeds ~4000 characters, summarize the key findings in 5–10 bullet points
- Offer: "Full output is long. Want me to save it to a file?" (use `--output-last-message`)

### 6. Subagents (Multi-Agent, Experimental)

Codex has an experimental **multi-agent** mode where it can spawn and coordinate parallel subagents internally. Enable it with:

```bash
codex exec --enable multi_agent -m {model} -s {sandbox} "{prompt}"
```

**When to enable `multi_agent`:**
- Tasks with clearly independent workstreams (e.g., "audit all files in src/ in parallel")
- Large codebases where sequential file-by-file review is too slow
- Prompts that explicitly ask for parallel investigation

**When NOT to enable it:**
- Simple single-file tasks — subagent overhead isn't worth it
- `high` effort + `multi_agent` together = very slow, very expensive — avoid unless necessary

`multi_agent` is `experimental` (off by default). Inform the user it may behave unexpectedly.

**AGENTS.md — project-level instructions for Codex:**

Codex reads `AGENTS.md` files from three locations (merged in order):
1. `~/.codex/AGENTS.md` — global instructions
2. `{project_root}/AGENTS.md` — project-specific instructions
3. `{working_dir}/AGENTS.md` — directory-specific instructions

If a project has special conventions (coding style, test commands, forbidden patterns), suggest the user add an `AGENTS.md` to their repo root. This improves Codex output quality without changing the skill prompt every time.

### 7. Post-Execution (Feedback Loop)

After relaying Codex output, **don't just stop**. Offer next steps:

- If Codex found issues → "Want me to fix these?"
- If Codex suggested changes → "Should I apply these edits?" (re-invoke with `workspace-write`)
- If analysis was broad → "Want me to dig deeper into any specific finding?"
- If Codex refactored code → "Want me to run your tests to verify?"

This turns a one-shot delegation into an iterative workflow.

### 8. Session Resumption

```bash
# Resume most recent session (non-interactive)
codex exec resume --last

# Resume by session ID
codex exec resume {session-id}

# Resume interactive session (opens TUI)
codex resume --last
```

Trigger on: "continue", "resume", "follow up", "pick up where Codex left off", "last session".

Note: Sessions are not saved if `--ephemeral` was used.

## Common Issues

| Problem | Fix |
|---------|-----|
| `command not found: codex` | Install via `npm i -g @openai/codex`, add to PATH |
| Auth error / expired token | Run `codex login` |
| Unknown model | Re-read `~/.codex/config.toml` — model names change across versions |
| Sandbox permission denied | Escalate: `read-only` → `workspace-write` → `danger-full-access` (confirm) |
| No config.toml found | Run `codex` once to generate it, or specify model manually |
| Output is empty | Check stderr — likely a silent failure. Re-run with `2>&1` |
| Codex hangs / times out | Re-run with `low` or `medium` effort, or narrow the file scope in the prompt |
| Slow despite `medium` effort | MCP servers (playwright/figma/etc.) load on every run — ~5-10s startup cost |
| Web searches spiral (slow) | Add "Do not search the web" to the prompt for local-only tasks |
| `multi_agent` not working | It's experimental — may fail silently. Remove `--enable multi_agent` to fall back |
