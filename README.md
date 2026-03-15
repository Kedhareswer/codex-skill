---
# codex-skill

![codex-skill demo](./demo.gif)

---

*Already using Claude Code or Codex CLI? You're leaving half the capability on the table.*
*Still deciding which AI CLI to use? You don't have to choose.*

**Let your Claude handle your Codex.**

Two of the best coding AI CLIs alive right now — and almost nobody uses them together. This skill is the bridge. One file. Active in every session. Zero terminal switching.

---

## Why This Exists

### The Codex problem

Codex CLI wraps a world-class model in a frustratingly barebones harness.

- Re-approves the same shell commands every single run — no session-level trust
- Sandbox is paranoid by default — commands fail silently, no clear reason why
- No plan mode. No skills. No MCP. No persistent context.
- Switching models means remembering flag syntax. Every time.

> *"It's just a really good model wrapped in an okay harness."*
> — Hacker News thread on Codex CLI launch

### The Claude problem

Claude Code is the best orchestrator in the space — but it has real limits when you need disciplined execution.

- Token costs spiral fast. $10–65 per session before you notice.
- Zero memory between sessions — re-explain your entire stack on every cold start.
- Complex, multi-file tasks sometimes drift. Needs handholding to stay on track.
- No native path to drop into Codex-style execution when you need precision over conversation.

> *"Claude is incredible for planning and reasoning but I keep switching to Codex when I need it to just do the thing without 3 confirmation messages."*
> — r/ClaudeAI

### The gap

Right now, the workflow for most developers is: open Claude, plan something, switch terminal, open Codex, re-type the model name, re-type the effort level, run it, switch back. Every. Single. Time.

The pattern that fixes this already exists. Most people just don't know about it.

---

## What This Skill Does

Install this skill and Claude orchestrates Codex for you — interactively, with full context, on every run.

```
you  →  Claude  →  Codex CLI  →  your codebase
        plans       executes
```

**Claude handles:**
- Reads your live `~/.codex/config.toml` to detect the current model — never hardcodes
- Opens an interactive prompt (model + reasoning effort) before every Codex run
- Builds and runs the exact `codex exec` command with correct flags
- Picks sandbox mode automatically based on the task type
- Relays all Codex output verbatim — no paraphrasing, no summarizing
- Resumes previous Codex sessions by ID or `--last`
- Confirms before using `danger-full-access` — always

**You get:**
- Claude's context, memory (within session), planning, and orchestration
- Codex's disciplined, on-task, consistent code execution
- An interactive model/effort selector on every run — no memorizing flags
- A full audit trail: the command Claude ran is always shown before output
- Model agnosticism — works with whatever Codex ships next

---

## Claude vs Codex — Why You Want Both

| | Claude Code | Codex CLI |
|---|---|---|
| Code reasoning | Best-in-class (0.71 SWE-CI) | Consistent, disciplined, on-task |
| Harness / tooling | Rich — plan mode, skills, MCP, approvals | Barebones wrapper |
| Token cost per session | $6–65 | Lighter footprint |
| Stays on task | Sometimes drifts | Rarely drifts |
| Cross-session memory | None | None |
| Open source | Proprietary | Apache 2.0 |
| Sandboxing | Transparent | Paranoid by default |
| Best for | Planning, orchestration, context | Execution, precision, file edits |
| Ecosystem | MCP servers, skills, hooks | Raw CLI, scriptable |
| Community verdict | Best orchestrator | Best executor |

The dev community has been converging on this pattern for months: **Claude plans and orchestrates, Codex executes reliably.** This skill is that bridge. One SKILL.md file.

---

## Real Examples

Each example shows: what you typed → the interactive prompt → the command Claude built → what came back.

---

### 1. Analyze a file

**You type:**
```
use Codex to analyze src/App.tsx
```

**Claude opens:**
```
Model        ● gpt-5.4 (current)
               gpt-5.2-codex
               other

Thinking     ● medium — balanced
               low    — quick
               high   — deep, thorough
```

**Claude builds and runs:**
```bash
codex exec -m gpt-5.4 -c model_reasoning_effort=medium -s read-only \
  "Analyze src/App.tsx for bugs, code quality issues, and architectural concerns"
```

**Codex returns:**
```
src/App.tsx — 3 issues found

  1. Lazy-loading not applied to CaseStudy routes — all chunks load on /
  2. ChatContext re-renders on every nav — move provider above Router
  3. useScrollTrigger imported but never called in App.tsx
```

---

### 2. Refactor a module

**You type:**
```
use Codex to refactor the auth module to async/await
```

**Claude opens the selector → you pick `high` thinking, confirm `workspace-write`**

**Claude builds:**
```bash
codex exec -m gpt-5.4 -c model_reasoning_effort=high -s workspace-write \
  "Refactor src/lib/auth.ts to replace all Promise chains with async/await. Preserve all existing behaviour."
```

Codex edits the file directly. Claude relays the diff summary and asks if you want to review before saving.

---

### 3. Security audit

**You type:**
```
run a Codex security audit on the API routes
```

**Claude selects `read-only` automatically** (analysis task, no write needed):

```bash
codex exec -m gpt-5.4 -c model_reasoning_effort=high -s read-only \
  "Audit src/api/ for OWASP Top 10 vulnerabilities. Flag any injection risks, auth gaps, or exposed secrets."
```

Codex returns a structured findings list. Claude surfaces critical findings first.

---

### 4. Dependency review

**You type:**
```
use Codex to check if our dependencies are outdated or have known CVEs
```

**Claude builds:**
```bash
codex exec -m gpt-5.4 -c model_reasoning_effort=medium -s read-only \
  "Review package.json. List outdated packages, flag any with known CVEs, suggest upgrade path."
```

---

### 5. Generate tests

**You type:**
```
use Codex to write unit tests for src/lib/chatbotMatcher.ts
```

**Claude picks `workspace-write`, selects `high` thinking:**
```bash
codex exec -m gpt-5.4 -c model_reasoning_effort=high -s workspace-write \
  "Write comprehensive unit tests for src/lib/chatbotMatcher.ts. Cover edge cases. Use existing test patterns in the repo."
```

---

### 6. Resume a session

**You type:**
```
resume the last Codex session
```

**Claude runs:**
```bash
codex exec resume --last
```

Picks up exactly where the previous session ended — same context, same file state.

---

## Prerequisites

You need both CLIs installed and working:

```bash
claude --version   # Claude Code
codex --version    # Codex CLI
codex login        # authenticate
```

- [Install Claude Code](https://docs.anthropic.com/claude-code)
- [Install Codex CLI](https://github.com/openai/codex)

---

## Install

### Option 1 — Tell Claude (recommended)

Open any Claude Code session and paste:

```
Install the codex skill from https://github.com/Kedhareswer/codex-skill
Copy skills/codex/SKILL.md to ~/.claude/skills/codex/SKILL.md
```

Claude fetches and installs it automatically. No terminal needed.

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

### Verify it works

Tell Claude:

```
use Codex to say hello
```

The model/effort selector appears. Pick anything, press Enter. If Codex responds — the skill is live.

---

## The Demo

The `demo.gif` at the top is a **300-frame, 10-second animation** built with [Remotion](https://github.com/remotion-dev/remotion) — React components that render to video. Here's everything about it.

### What you're watching

**Scene 1 — The Problem (frames 0–89, 3s)**
Side-by-side cards showing the real friction of Codex alone vs Claude alone. Each issue animates in with a red ✗. The bottom line lands last: *"Using both with no bridge? Manual switching. Every. Single. Time."* — this is the tension Scene 2 resolves.

**Scene 2 — The Bridge (frames 90–179, 3s)**
Four nodes spring in: `You → Claude → Codex CLI → Codebase`. Arrows appear after each node settles. Closes with the tagline: *"Let your Claude handle your Codex."*

**Scene 3 — Live Terminal (frames 180–299, 4s)**
A prompt typed character-by-character, the model/effort selector appearing, then Codex output streaming line by line. Scanline overlay for texture.

---

### Key Remotion patterns

**Typing effect** — characters revealed frame by frame:
```tsx
const charsTyped = Math.floor(age * 2.5); // 2.5 chars per frame = ~40 chars/sec
const visible = line.text.slice(0, Math.min(charsTyped, line.text.length));
```

**Spring entrance** — physics-based, not easing curves:
```tsx
const s = spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 16 } });
// s goes 0 → 1. Wire it to opacity, scale, translateY — anything.
style={{
  opacity: interpolate(s, [0, 1], [0, 1]),
  transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
}}
```

**Scene gating** — hard frame boundaries, each scene fades in:
```tsx
const scene = frame < 90 ? 0 : frame < 180 ? 1 : 2;
const opacity = interpolate(frame - sceneStart, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
```

**Staggered items** — each card/line enters with an index-based delay:
```tsx
items.map((item, i) => {
  const delay = i * 20; // 20 frames between each item (~0.67s)
  const s = spring({ frame: frame - delay, fps, config: { stiffness: 60, damping: 14 } });
  return <div style={{ opacity: interpolate(s, [0,1],[0,1]) }}>{item}</div>;
})
```

**Scanline overlay** — CRT texture, zero performance cost:
```tsx
backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)'
```

---

### Run it yourself

```bash
cd demo
npm install

npm run render        # → ../demo.gif  (300 frames, ~428 KB)
npm run render:mp4    # → ../demo.mp4  (higher quality, larger)
npx remotion studio   # opens localhost:3000 — scrub live in browser
```

Remotion Studio is essential for tuning timing — scrub frame-by-frame, see changes instantly.

---

### Fork and customize

**Swap the terminal lines** — edit `termLines` in `demo/src/CodexSkillDemo.tsx`:
```tsx
const termLines: TermLine[] = [
  // frame = when this line appears, relative to scene start (frame 180)
  { frame: 0,   type: 'prompt', text: 'your command here' },
  { frame: 40,  type: 'select', text: '● your-model   ○ other-model' },
  { frame: 75,  type: 'output', text: '✓  Your result here', color: GREEN },
];
```

**Change colors** — constants at the top of `CodexSkillDemo.tsx`:
```tsx
const RED   = '#c0392b';  // primary accent (prompts, highlights)
const GREEN = '#3fb950';  // success / output lines
const BLUE  = '#58a6ff';  // secondary accent (selector, Claude node)
const BG    = '#0d1117';  // background — matches GitHub dark
```

**Add a Scene 4** — extend duration, add component, extend gate:
```tsx
// Root.tsx
durationInFrames={400}  // was 300, added 100 frames (~3.3s)

// CodexSkillDemo.tsx
const scene = frame < 90 ? 0 : frame < 180 ? 1 : frame < 300 ? 2 : 3;
{scene === 3 && <YourNewScene frame={frame} fps={fps} />}
```

**Adjust timing** — all frame values are at 30fps. Frame 30 = 1s. Frame 90 = 3s. Change `frame:` values in `termLines` or scene boundaries to speed up or slow down any section.

---

## Repo Structure

```
codex-skill/
├── skills/
│   └── codex/
│       └── SKILL.md           ← the skill Claude reads
├── demo/
│   ├── src/
│   │   ├── Root.tsx            ← Remotion entry + registerRoot
│   │   └── CodexSkillDemo.tsx  ← all 3 scenes + compositions
│   ├── remotion.config.ts
│   ├── tsconfig.json
│   └── package.json
├── demo.gif                    ← rendered output (300 frames @ 30fps)
├── README.md
└── LICENSE
```

Skills live in `~/.claude/skills/`. Once `SKILL.md` is there, it's active in every session — no restart, no config.

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

> Built by [Kedhareswer](https://github.com/Kedhareswer).
> Inspired by the gap every developer falls into when switching between Claude and Codex.
>
> If this saved you time — star the repo. It helps others find it.
