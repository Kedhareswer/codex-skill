# codex-skill

**Let your Claude handle your Codex.**

A Claude Code skill that bridges the two best coding AI CLIs — so you get Claude's intelligence, orchestration, and tooling *with* Codex's disciplined, consistent code execution.

![codex-skill demo](./demo.gif)

---

## The Problem

Everyone using either tool alone hits the same walls.

### Codex CLI alone
- Re-approves the same commands on every single run — no session memory
- Sandbox is paranoid by default — commands silently fail with no explanation
- No plan mode, no skills, no MCP integration
- Barebones harness around a great model
- *"It's just a really good model wrapped in an okay harness."* — Hacker News

### Claude Code alone
- Token costs spiral — $10–65 per session before you notice
- Zero memory between sessions — re-explain your whole stack every time
- Complex tasks need handholding; easy to go off-track
- No native way to drop into Codex execution when you need it

### Using both with no bridge
- Manual terminal switching between tools
- Re-typing model names, effort levels, and sandbox flags every time
- No shared context. No orchestration. Just copy-paste.

---

## What This Does

Installs a skill into Claude Code so Claude orchestrates Codex for you — with interactive model selection on every run.

```
you → Claude → Codex CLI → your codebase
```

**Claude handles:**
- Reads your `~/.codex/config.toml` to detect your current model
- Shows an interactive selection prompt for model + reasoning effort
- Builds and runs the correct `codex exec` command with proper flags
- Relays all Codex output back verbatim
- Auto-selects sandbox mode based on what you're asking
- Resumes previous Codex sessions on request

**You get:**
- Claude's context, orchestration, and planning
- Codex's disciplined, reliable code execution
- No memorizing CLI flags or syntax
- No switching terminals

---

## Claude vs Codex — Why You Want Both

| | Claude Code | Codex CLI |
|---|---|---|
| Code reasoning | Best-in-class (0.71 SWE-CI) | Consistent, on-task |
| Tooling / harness | Rich — plan mode, skills, MCP | Barebones |
| Token cost per session | $6–65 | Lighter footprint |
| Stays on task | Sometimes drifts | Rarely drifts |
| Cross-session memory | None | None |
| Open source | Proprietary | Apache 2.0 |
| Sandboxing | Transparent | Paranoid by default |
| Community consensus | Best orchestrator | Best executor |

The pattern the dev community is converging on: **Claude plans and orchestrates, Codex executes reliably.** This skill is that bridge.

---

## Prerequisites

- [Claude Code](https://docs.anthropic.com/claude-code) installed
- [Codex CLI](https://github.com/openai/codex) installed and on `$PATH`
- Valid Codex credentials configured

```bash
# verify both are ready
claude --version
codex --version
codex login
```

---

## Install

### Option 1 — Tell Claude (recommended)

Paste this into any Claude Code session:

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

Once installed, just tell Claude what to do:

| You type | What happens |
|----------|-------------|
| `use Codex to analyze src/App.tsx` | Interactive prompt → runs analysis |
| `use Codex to refactor the auth module` | Interactive prompt → workspace write |
| `run Codex on this with high thinking` | Skips model prompt → runs at high effort |
| `resume the last Codex session` | Continues from previous session ID |

Every run opens an interactive selector — navigate with arrows, press Enter to confirm:

```
Which model should I use?
  ● gpt-5.4   (your current config)
    gpt-5.2-codex
    other — type a model name

What reasoning effort?
  ● medium — balanced
    low    — quick, surface-level
    high   — deep, thorough
```

No typing flags. No memorizing syntax. Select and go.

---

## How It Works

The skill reads your live Codex config, builds the right command, and runs it:

```bash
codex exec -m [model] -c model_reasoning_effort=[effort] -s [sandbox] "[prompt]"
```

Sandbox mode is chosen automatically:

| Task type | Sandbox |
|-----------|---------|
| Analysis, review | `read-only` |
| File edits, refactors | `workspace-write` |
| Anything destructive | `danger-full-access` — asks you first |

---

## Repo Structure

```
codex-skill/
├── skills/
│   └── codex/
│       └── SKILL.md      ← the skill Claude reads
├── demo/                  ← Remotion source for the demo GIF
│   └── src/
│       ├── Root.tsx
│       └── CodexSkillDemo.tsx
├── demo.gif               ← rendered demo (300 frames @ 30fps = 10s)
├── README.md
└── LICENSE
```

Claude Code loads skills from `~/.claude/skills/`. Once `SKILL.md` is there, the skill is active in every session.

---

## Update

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

---

> Built by [Kedhareswer](https://github.com/Kedhareswer). Inspired by the gap every developer falls into when switching between Claude and Codex.
