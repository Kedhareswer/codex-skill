# codex-skill

**Let your Claude handle your Codex.**

A Claude Code skill that bridges the two best coding AI CLIs — so you stop switching terminals and start shipping.

---

## The problem

![before-after](./before-after.gif)

Two great tools. No bridge between them.

**Codex CLI alone** — great model, barebones harness. Re-approves the same commands every run. Paranoid sandbox. No plan mode, no skills, no MCP.

**Claude Code alone** — best orchestrator in the space. But token costs spiral, no cross-session memory, and no native path to disciplined execution.

**Using both manually** — two terminals, re-typing model names and flags every time, context lost between them.

---

## The solution

![demo](./demo.gif)

Install this skill. Claude reads your Codex config, shows you an interactive selector for model and reasoning effort, builds the right command, and runs it — all without leaving your conversation.

```
you  →  Claude  →  Codex CLI  →  your codebase
        plans       executes
```

---

## What Claude handles

- Reads `~/.codex/config.toml` live — never hardcodes a model name
- Interactive `AskUserQuestion` selector for model + reasoning effort on every run
- Builds the exact `codex exec` command with correct flags
- Auto-picks sandbox mode based on task type
- Relays Codex output verbatim
- Resumes sessions with `--last` or by ID
- Always confirms before `danger-full-access`

---

## Quick comparison

| | Claude Code | Codex CLI |
|---|---|---|
| Best for | Planning, orchestration | Execution, precision |
| Harness | Rich — skills, MCP, plan mode | Barebones |
| Token cost | $6–65/session | Lighter |
| Stays on task | Sometimes drifts | Rarely drifts |
| Open source | No | Apache 2.0 |
| Community verdict | Best orchestrator | Best executor |

---

## Install

**Option 1 — tell Claude:**
```
Install the codex skill from https://github.com/Kedhareswer/codex-skill
```

**Option 2 — one-liner:**
```bash
mkdir -p ~/.claude/skills/codex && curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

**Option 3 — clone:**
```bash
git clone https://github.com/Kedhareswer/codex-skill
cp -r codex-skill/skills/codex ~/.claude/skills/codex
```

**Verify:** Tell Claude `use Codex to say hello` — if the selector appears and Codex responds, you're live.

---

## Usage examples

| You say | What happens |
|---------|-------------|
| `use Codex to analyze src/App.tsx` | Selector → analysis with `read-only` |
| `use Codex to refactor the auth module` | Selector → edits with `workspace-write` |
| `run a Codex security audit on src/api/` | Auto `read-only` → OWASP findings |
| `resume the last Codex session` | `codex exec resume --last` |

---

## Prerequisites

```bash
claude --version && codex --version && codex login
```

- [Install Claude Code](https://docs.anthropic.com/claude-code)
- [Install Codex CLI](https://github.com/openai/codex)

---

## Repo

```
codex-skill/
├── skills/codex/SKILL.md     ← install this
├── demo.gif
├── before-after.gif
└── README.md
```

---

## Update

```bash
curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

---

MIT License — [Kedhareswer](https://github.com/Kedhareswer)

> If this saved you time — star the repo.
