import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import React from "react";

const BG     = "#0d1117";
const RED    = "#c0392b";
const GREEN  = "#3fb950";
const WHITE  = "#ffffff";
const DIM    = "rgba(255,255,255,0.30)";
const MUTED  = "rgba(255,255,255,0.55)";
const BORDER = "rgba(255,255,255,0.08)";
const YELLOW = "#e3b341";

// ─── Scene 1: BEFORE — painful manual workflow (0–150 frames = 5s) ────────────
const beforeSteps = [
  { label: "Open Claude terminal",          color: MUTED,  icon: "1" },
  { label: "Plan the refactor with Claude", color: MUTED,  icon: "2" },
  { label: "Switch to second terminal",     color: YELLOW, icon: "3" },
  { label: "Remember model name...",        color: YELLOW, icon: "4" },
  { label: "codex exec -m ??? ...",         color: RED,    icon: "5" },
  { label: "Wrong flags. Re-type.",         color: RED,    icon: "✗" },
  { label: "Switch back to Claude",         color: YELLOW, icon: "6" },
  { label: "Re-explain the context",        color: RED,    icon: "✗" },
];

const BeforeScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const titleS = spring({ frame, fps, config: { stiffness: 70, damping: 16 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: "44px 60px", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        opacity: interpolate(titleS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(titleS, [0, 1], [-10, 0])}px)`,
        marginBottom: 32,
      }}>
        <div style={{ color: RED, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 8 }}>
          Without this skill
        </div>
        <div style={{ color: WHITE, fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>
          Every. Single. Time.
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {beforeSteps.map((step, i) => {
          const delay = 20 + i * 14;
          const s = spring({ frame: frame - delay, fps, config: { stiffness: 80, damping: 18 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const tx = interpolate(s, [0, 1], [-16, 0]);

          return (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: op,
              transform: `translateX(${tx}px)`,
              padding: "10px 16px",
              border: `1px solid ${step.color === RED ? RED + "33" : step.color === YELLOW ? YELLOW + "22" : BORDER}`,
              backgroundColor: step.color === RED ? RED + "08" : "transparent",
            }}>
              <span style={{
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${step.color}`,
                color: step.color,
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {step.icon}
              </span>
              <span style={{ color: step.color, fontFamily: "monospace", fontSize: 13 }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pain summary */}
      <div style={{
        marginTop: 24,
        opacity: interpolate(frame, [130, 148], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        color: DIM,
        fontFamily: "monospace",
        fontSize: 12,
        textAlign: "center" as const,
        letterSpacing: "0.05em",
      }}>
        8 steps. 2 terminals. Context lost. Every time.
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: AFTER — with the skill (150–300 frames = 5s) ────────────────────
const afterSteps = [
  { label: "tell Claude what you want",        color: GREEN,  icon: "1", time: "0s" },
  { label: "pick model from selector",         color: GREEN,  icon: "2", time: "2s" },
  { label: "pick reasoning effort",            color: GREEN,  icon: "3", time: "3s" },
  { label: "Codex runs. Output relayed.",       color: WHITE,  icon: "✓", time: "done" },
];

const AfterScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 150;
  const titleS = spring({ frame: localFrame, fps, config: { stiffness: 70, damping: 16 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: "44px 60px", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        opacity: interpolate(titleS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(titleS, [0, 1], [-10, 0])}px)`,
        marginBottom: 32,
      }}>
        <div style={{ color: GREEN, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" as const, marginBottom: 8 }}>
          With codex-skill
        </div>
        <div style={{ color: WHITE, fontFamily: "monospace", fontSize: 22, fontWeight: 700 }}>
          One conversation. Done.
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
        {afterSteps.map((step, i) => {
          const delay = 20 + i * 20;
          const s = spring({ frame: localFrame - delay, fps, config: { stiffness: 80, damping: 18 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const tx = interpolate(s, [0, 1], [-16, 0]);

          return (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: op,
              transform: `translateX(${tx}px)`,
              padding: "14px 20px",
              border: `1px solid ${GREEN}33`,
              backgroundColor: GREEN + "08",
            }}>
              <span style={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${GREEN}`,
                color: GREEN,
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {step.icon}
              </span>
              <span style={{ color: step.color, fontFamily: "monospace", fontSize: 14, flex: 1 }}>
                {step.label}
              </span>
              <span style={{ color: DIM, fontFamily: "monospace", fontSize: 11 }}>
                {step.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal snippet */}
      <div style={{
        opacity: interpolate(localFrame, [100, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        border: `1px solid ${BORDER}`,
        padding: "16px 20px",
        fontFamily: "monospace",
        fontSize: 13,
      }}>
        <div style={{ color: RED, marginBottom: 6, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" as const }}>
          Claude built this for you
        </div>
        <div style={{ color: DIM }}>
          <span style={{ color: RED }}>$</span>{" "}
          <span style={{ color: MUTED }}>codex exec -m gpt-5.4 -c model_reasoning_effort=medium</span>
        </div>
        <div style={{ color: DIM, paddingLeft: 14 }}>
          <span style={{ color: MUTED }}>-s read-only </span>
          <span style={{ color: WHITE }}>"refactor the auth module"</span>
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 24,
        opacity: interpolate(localFrame, [130, 148], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        color: GREEN,
        fontFamily: "monospace",
        fontSize: 13,
        textAlign: "center" as const,
        letterSpacing: "0.05em",
      }}>
        4 steps. 1 terminal. Full context. Every time.
      </div>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scene = frame < 150 ? "before" : "after";
  const sceneStart = scene === "before" ? 0 : 150;
  const fadeIn = interpolate(frame - sceneStart, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ opacity: fadeIn, width: "100%", height: "100%" }}>
        {scene === "before" && <BeforeScene frame={frame} fps={fps} />}
        {scene === "after"  && <AfterScene  frame={frame} fps={fps} />}
      </div>

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
        opacity: 0.15,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
