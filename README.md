# codex-skill

**Stop switching terminals. Let Claude run your Codex.**

You're already in Claude. You've got a plan. Now you just want Codex to execute it — without opening a second terminal, re-typing model names, or losing your context.

This skill makes that happen. One conversation. Both tools.

---

## The problem

![before-after](./before-after.gif)

You love both. Using both manually is painful.

**Codex CLI** — precise, disciplined executor. But barebones. You're re-approving the same commands every run, guessing flags, losing context the moment you switch windows.

**Claude Code** — best orchestrator alive. But expensive at scale, and there's no native path to hand off execution to something more focused.

**Using both without a bridge?** Two terminals. Re-typing model names. Context gone every time you switch. Every. Single. Time.

---

## The solution

![demo](./demo.gif)

Install this skill and just say what you want. Claude reads your Codex config, pops up a model + reasoning selector, builds the exact command, runs it — and then asks if you want it to act on what Codex found.

```
you  →  Claude  →  Codex CLI  →  your codebase
        plans       executes       gets better
```

No flags to remember. No terminal switching. No re-explaining context.

---

## What Claude handles for you

- Reads `~/.codex/config.toml` live — never hardcodes a model name
- Shows an interactive selector for model + reasoning effort before every run
- Picks the right sandbox automatically (`read-only` for analysis, `workspace-write` for edits)
- Captures errors and tells you exactly what went wrong (no silent failures)
- Injects project context — repo name, branch, working directory — into every Codex prompt
- Relays output verbatim, then asks "Want me to fix these?" to close the loop
- Resumes sessions with `--last` or by ID when you want to continue where Codex left off
- Always confirms before touching anything with `danger-full-access`

---

## How it feels to use

Just talk to Claude the way you normally do. The skill activates on anything that sounds like Codex work:

| You say | What happens |
|---------|-------------|
| `use Codex to analyze src/App.tsx` | Model selector → analysis, `read-only` sandbox |
| `have Codex refactor the auth module` | Model selector → edits, `workspace-write` sandbox |
| `let Codex do a security audit on src/api/` | Runs OWASP-style analysis, offers to fix findings |
| `send this to Codex with high reasoning` | Skips to effort selector, deep analysis |
| `resume the last Codex session` | `codex exec resume --last`, picks up right where you left off |

No magic words required — Claude will recognize "use Codex", "run Codex", "let Codex", "have Codex", "send to Codex", and more.

---

## Claude vs Codex — why you want both

| | Claude Code | Codex CLI |
|---|---|---|
| Best at | Planning, orchestration, big picture | Focused execution, precise edits |
| Tooling | Rich — skills, MCP, plan mode | Barebones by design |
| Token cost | Higher at scale | Leaner |
| Stays on task | Can drift | Rarely drifts |
| Open source | No | Apache 2.0 |
| Sweet spot | Thinking through the problem | Executing the solution |

Together they're better than either alone. This skill is the bridge.

---

## Install

**The lazy way — just tell Claude:**
```
Install the codex skill from https://github.com/Kedhareswer/codex-skill
```
Claude will handle it.

**One-liner:**
```bash
mkdir -p ~/.claude/skills/codex && curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

**Clone and copy:**
```bash
git clone https://github.com/Kedhareswer/codex-skill
cp -r codex-skill/skills/codex ~/.claude/skills/codex
```

**Verify it's working:** Tell Claude `use Codex to say hello` — the model selector should appear and Codex should respond. If it does, you're live.

---

## Prerequisites

You'll need both CLIs installed and authenticated:

```bash
claude --version && codex --version && codex login
```

- [Install Claude Code](https://docs.anthropic.com/claude-code)
- [Install Codex CLI](https://github.com/openai/codex)

---

## Keeping it up to date

```bash
curl -o ~/.claude/skills/codex/SKILL.md \
  https://raw.githubusercontent.com/Kedhareswer/codex-skill/main/skills/codex/SKILL.md
```

Or just tell Claude: `update my codex skill`.

---

## Repo

```
codex-skill/
├── skills/codex/SKILL.md     ← the only file you need
├── demo.gif
├── before-after.gif
└── README.md
```

---

## Thoughts, issues, ideas?

This is a living skill — it'll get better as Codex and Claude both evolve.

If something doesn't work the way you expect, **open an issue** — even a one-liner like "the selector didn't appear when I said X" is enough to go on.

If you have an idea for how the skill should behave differently, **open a discussion or PR**. The SKILL.md is just a markdown file — contributions are easy.

And if this saved you even one terminal switch today — **please star the repo.** It genuinely helps.

---

MIT License — built by [Kedhareswer](https://github.com/Kedhareswer)

> Two great tools. One conversation. Go ship something.
