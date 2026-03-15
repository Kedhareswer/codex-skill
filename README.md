# codex-skill

**Let your Claude handle your Codex.**

A Claude Code skill that bridges the two best coding AI CLIs — so you get Claude's intelligence, tooling, and orchestration *with* Codex's disciplined code execution.

---

## The Problem

Developers using either tool alone hit the same walls.

**Codex CLI alone:**
- No session-level command approval — re-asks permission for the same commands every run
- Sandbox is paranoid by default — commands silently fail, no clear reason why
- No plan mode, no skills, no MCP integration
- Consistent code quality, but the harness is barebones
- *"It's just a really good model wrapped in an okay harness."* — HN

**Claude Code alone:**
- Token costs spiral fast — $10–65 per session without noticing
- Zero memory between sessions — re-explains your whole project every time
- Sometimes goes off on tangents on complex tasks; needs handholding
- Every session starts from zero

**Using both, no bridge:**
- Switching manually between terminals
- Re-typing model names, effort levels, sandbox modes every time
- No shared context, no orchestration

---

## What This Skill Does

Installs a Claude Code skill so Claude orchestrates Codex for you.

```
you → Claude → Codex CLI → your codebase
```

**Claude handles:**
- Reads your `~/.codex/config.toml` to detect your current model
- Shows an interactive prompt to pick model + reasoning effort before every run
- Builds and executes the correct `codex exec` command
- Relays Codex output back verbatim
- Auto-selects sandbox mode based on the task
- Resumes previous Codex sessions on request

**You get:**
- Claude's orchestration, context, and tooling
- Codex's disciplined, consistent code execution
- No context switching between tools
- Correct CLI flags every time — no memorizing syntax

---

## Claude vs Codex — What Each Does Better

| | Claude Code | Codex CLI |
|---|---|---|
| Code reasoning | Best-in-class (0.71 SWE-CI) | Consistent, disciplined |
| Tooling / harness | Rich — plan mode, skills, MCP, approvals | Barebones, missing core features |
| Token cost | $6–65/session | Lighter footprint (15 MB) |
| Goes off-track | Sometimes | Rarely — stays on task |
| Cross-session memory | None | None |
| Open source | Proprietary | Apache 2 |
| Sandboxing | Transparent | Paranoid by default |
| Community verdict | Best orchestrator | Best executor |

**The pattern the community is converging on:** Claude as the planner and orchestrator, Codex as the reliable worker. This skill is that bridge.

---

## Prerequisites

- [Claude Code](https://docs.anthropic.com/claude-code) installed
- [Codex CLI](https://github.com/openai/codex) installed and on PATH
- Valid Codex credentials

```bash
claude --version
codex --version
codex login
```

---

## Install

### Option 1 — Tell Claude (recommended)

Open Claude Code and paste:

```
Install the codex skill from https://github.com/Kedhareswer/codex-skill
Copy skills/codex/SKILL.md to ~/.claude/skills/codex/SKILL.md
```

Claude fetches and installs it automatically.

### Option 2 — One-liner

```bash
mkdir -p ~/.claude/skills/codex && curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

### Option 3 — Clone

```bash
git clone https://github.com/Kedhareswer/codex-skill
cp -r codex-skill/skills/codex ~/.claude/skills/codex
```

---

## Usage

After installing, just talk to Claude:

| You say | What happens |
|---------|-------------|
| `use Codex to analyze src/App.tsx` | Interactive prompt → runs Codex analysis |
| `use Codex to refactor the auth module` | Interactive prompt → runs with workspace write |
| `run Codex on this with high thinking` | Asks model only → runs at high effort |
| `resume the last Codex session` | Continues from the previous session |

Every run shows an interactive selector:

```
Which model should I use?
  ● gpt-5.4 (current config)
    gpt-5.2-codex
    Other

What reasoning effort?
  ● medium — balanced
    low — quick
    high — deep
```

No typing model names. No memorizing flags. Select and go.

---

## How It Works

The skill reads your live Codex config, builds the right command, and runs it:

```bash
codex exec -m [model] -c model_reasoning_effort=[effort] -s [sandbox] "[prompt]"
```

Sandbox is selected automatically:
- `read-only` — for analysis tasks
- `workspace-write` — when file edits are needed
- `danger-full-access` — only with explicit user confirmation

---

## Repo Structure

```
codex-skill/
├── skills/
│   └── codex/
│       └── SKILL.md    ← Claude reads this
├── README.md
└── LICENSE
```

Claude Code loads skills from `~/.claude/skills/`. Once `SKILL.md` is there, the skill is active in every conversation.

---

## Updating

```bash
curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

Or tell Claude:

```
Update my codex skill from https://github.com/Kedhareswer/codex-skill
```

---

## License

MIT — use it, fork it, extend it.
