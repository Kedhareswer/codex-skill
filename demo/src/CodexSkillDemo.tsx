import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import React from "react";

const BG = "#0d1117";
const RED = "#c0392b";
const WHITE = "#ffffff";
const DIM = "rgba(255,255,255,0.35)";
const MUTED = "rgba(255,255,255,0.55)";
const BORDER = "rgba(255,255,255,0.08)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";

// ── Scene 1: Problem (0–90 frames = 3s) ──────────────────────────────────────
const ProblemScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const items = [
    { label: "Codex alone", issues: ["re-approve every command", "paranoid sandbox", "no plan mode"], color: "#f0883e" },
    { label: "Claude alone", issues: ["$10–65/session", "zero memory", "needs handholding"], color: BLUE },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: "48px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* Label */}
      <div style={{ color: RED, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 24, opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }}>
        The Problem
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {items.map((item, idx) => {
          const delay = idx * 20;
          const s = spring({ frame: frame - delay, fps, config: { stiffness: 60, damping: 14 } });
          return (
            <div key={idx} style={{
              flex: 1,
              border: `1px solid ${item.color}33`,
              padding: "24px 28px",
              opacity: interpolate(s, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
            }}>
              <div style={{ color: item.color, fontFamily: "monospace", fontSize: 13, fontWeight: 700, marginBottom: 16, letterSpacing: "0.1em" }}>
                {item.label}
              </div>
              {item.issues.map((issue, i) => {
                const issueDelay = delay + i * 12;
                const isOpacity = interpolate(frame, [issueDelay + 8, issueDelay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, opacity: isOpacity }}>
                    <span style={{ color: RED, fontSize: 12 }}>✗</span>
                    <span style={{ color: MUTED, fontFamily: "monospace", fontSize: 13 }}>{issue}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom line */}
      <div style={{
        marginTop: 32,
        color: DIM,
        fontFamily: "monospace",
        fontSize: 12,
        textAlign: "center",
        opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Using both with no bridge? Manual switching. Every. Single. Time.
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Flow diagram (90–180 frames = 3s) ───────────────────────────────
const FlowScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 90;

  const nodes = [
    { label: "You", sub: "just type it", color: WHITE },
    { label: "Claude", sub: "orchestrates", color: BLUE },
    { label: "Codex CLI", sub: "executes", color: GREEN },
    { label: "Codebase", sub: "gets better", color: RED },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 64px" }}>
      <div style={{ color: RED, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 40, opacity: interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }}>
        The Bridge
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
        {nodes.map((node, i) => {
          const delay = i * 18;
          const s = spring({ frame: localFrame - delay, fps, config: { stiffness: 80, damping: 16 } });
          const arrowOpacity = i < nodes.length - 1
            ? interpolate(localFrame, [delay + 25, delay + 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 0;

          return (
            <React.Fragment key={i}>
              {/* Node */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: interpolate(s, [0, 1], [0, 1]),
                transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  border: `2px solid ${node.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  backgroundColor: `${node.color}11`,
                }}>
                  <span style={{ color: node.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700, textAlign: "center", letterSpacing: "0.05em" }}>
                    {node.label}
                  </span>
                </div>
                <span style={{ color: DIM, fontFamily: "monospace", fontSize: 11 }}>{node.sub}</span>
              </div>

              {/* Arrow */}
              {i < nodes.length - 1 && (
                <div style={{ opacity: arrowOpacity, color: MUTED, fontFamily: "monospace", fontSize: 20, flexShrink: 0, paddingBottom: 28, margin: "0 -4px" }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 48,
        color: MUTED,
        fontFamily: "monospace",
        fontSize: 14,
        opacity: interpolate(localFrame, [72, 90], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Let your Claude handle your Codex.
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Terminal demo (180–300 frames = 4s) ──────────────────────────────
interface TermLine { frame: number; type: "prompt" | "output" | "select" | "blank"; text: string; color?: string }

const termLines: TermLine[] = [
  { frame: 0,  type: "prompt", text: "use Codex to analyze src/App.tsx" },
  { frame: 40, type: "select", text: "● gpt-5.4 (current)   ○ gpt-5.2-codex" },
  { frame: 55, type: "select", text: "● medium — balanced   ○ low   ○ high" },
  { frame: 72, type: "blank",  text: "" },
  { frame: 75, type: "output", text: "Running: codex exec -m gpt-5.4 -c model_reasoning_effort=medium ...", color: DIM },
  { frame: 90, type: "output", text: "✓  Clean architecture. 3 issues flagged.", color: GREEN },
  { frame: 104, type: "output", text: "  → api/chat.ts imports from src/lib (coupling)", color: MUTED },
  { frame: 116, type: "output", text: "  → 3 lockfiles detected (pnpm + npm + bun)", color: MUTED },
  { frame: 128, type: "output", text: "  → eslint @typescript-eslint/no-unused-vars disabled", color: MUTED },
];

const TerminalScene: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  const localFrame = frame - 180;
  const cursorVisible = Math.floor(localFrame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: "40px 60px", display: "flex", flexDirection: "column" }}>
      {/* Title bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: `1px solid ${BORDER}`,
        marginBottom: 0,
        opacity: interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <span style={{ color: RED, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>Terminal</span>
        <span style={{ color: DIM, fontFamily: "monospace", fontSize: 10 }}>Claude Code — codex-skill active</span>
      </div>

      {/* Lines */}
      <div style={{ flex: 1, padding: "24px 20px", fontFamily: "monospace", fontSize: 14, lineHeight: 1.9 }}>
        {termLines.map((line, i) => {
          if (localFrame < line.frame) return null;
          const age = localFrame - line.frame;

          if (line.type === "blank") return <div key={i} style={{ height: 8 }} />;

          if (line.type === "prompt") {
            const charsTyped = Math.floor(age * 2.5);
            const visible = line.text.slice(0, Math.min(charsTyped, line.text.length));
            const typing = charsTyped < line.text.length;
            return (
              <div key={i} style={{ display: "flex" }}>
                <span style={{ color: RED, marginRight: 10, fontWeight: 700 }}>$</span>
                <span style={{ color: WHITE }}>{visible}</span>
                {typing && cursorVisible && <span style={{ display: "inline-block", width: 8, height: 16, backgroundColor: RED, marginLeft: 1 }} />}
              </div>
            );
          }

          if (line.type === "select") {
            const op = interpolate(age, [0, 8], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ opacity: op, paddingLeft: 22, color: BLUE, fontSize: 13 }}>
                {line.text}
              </div>
            );
          }

          const op = interpolate(age, [0, 8], [0, 1], { extrapolateRight: "clamp" });
          const tx = interpolate(age, [0, 8], [6, 0], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: op, transform: `translateX(${tx}px)`, color: line.color || MUTED, paddingLeft: line.type === "output" ? 22 : 0 }}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
        opacity: 0.15, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

// ── Root composition ──────────────────────────────────────────────────────────
export const CodexSkillDemo: React.FC = () => {
  const { frame, fps } = { frame: useCurrentFrame(), fps: useVideoConfig().fps };

  const scene = frame < 90 ? 0 : frame < 180 ? 1 : 2;

  const sceneOpacity = (sceneFrame: number, start: number) =>
    interpolate(sceneFrame - start, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: "monospace" }}>
      {scene === 0 && <div style={{ opacity: sceneOpacity(frame, 0) }}><ProblemScene frame={frame} fps={fps} /></div>}
      {scene === 1 && <div style={{ opacity: sceneOpacity(frame, 90) }}><FlowScene frame={frame} fps={fps} /></div>}
      {scene === 2 && <div style={{ opacity: sceneOpacity(frame, 180) }}><TerminalScene frame={frame} fps={fps} /></div>}
    </AbsoluteFill>
  );
};
