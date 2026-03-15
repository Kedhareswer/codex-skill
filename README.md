# codex-skill

A Claude Code skill that lets you invoke the **Codex CLI** directly from Claude — for code analysis, refactoring, editing, and more.

---

## What It Does

Once installed, you can say things like:

```
use Codex to analyze src/App.tsx
use Codex to refactor the auth module
run Codex on this file and fix the bugs
```

Claude will:
1. Check your current Codex config for the active model
2. Ask you to confirm the **model** and **reasoning effort** interactively
3. Run `codex exec` with your choices
4. Relay the output back verbatim

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- [Codex CLI](https://github.com/openai/codex) installed and on your PATH
- Valid Codex credentials (`codex login`)

Verify both are ready:

```bash
claude --version
codex --version
```

---

## Install

### Option 1 — Point Claude to this repo (recommended)

Open Claude Code and paste:

```
Install the codex skill from https://github.com/Kedhareswer/codex-skill
— copy skills/codex/SKILL.md to ~/.claude/skills/codex/SKILL.md
```

Claude will fetch the file and install it automatically.

### Option 2 — Manual

```bash
mkdir -p ~/.claude/skills/codex
curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

### Option 3 — Clone

```bash
git clone https://github.com/Kedhareswer/codex-skill
cp -r codex-skill/skills/codex ~/.claude/skills/codex
```

---

## Usage

After installing, just talk to Claude naturally:

| You say | What happens |
|---------|-------------|
| `use Codex to analyze src/App.tsx` | Analysis with your chosen model + effort |
| `use Codex to refactor the login module` | Refactor with workspace write access |
| `run Codex on this, high effort` | Deep analysis, still asks for model |
| `resume the last Codex session` | Picks up from where Codex left off |

Every run asks you to confirm:
- **Model** — dynamically read from your `~/.codex/config.toml`
- **Reasoning effort** — `low` / `medium` / `high`

---

## Skill Location

```
skills/
└── codex/
    └── SKILL.md    ← the actual skill Claude reads
```

Claude Code loads skills from `~/.claude/skills/`. Once `SKILL.md` is there, the skill is live in every conversation.

---

## Updating

To get the latest version:

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

MIT
