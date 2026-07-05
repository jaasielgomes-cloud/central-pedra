import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";

// Cenarios cinematograficos GERADOS POR CODIGO (nenhum asset externo).
// Usados como b-roll quando nao ha imagem/video real. Cada "kind" e tematico.
export type ArtKind = "stars" | "desert" | "mountain" | "dawn";

// --- Bloco 1: ceu estrelado (a promessa: "olhe as estrelas") ---
const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#060a18 0%,#0a1230 45%,#0d1024 100%)" }}>
      {/* faixa tipo via-lactea */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 40% at 50% 40%, rgba(120,140,220,0.18) 0%, rgba(0,0,0,0) 70%)",
          transform: `rotate(-20deg) translateY(${Math.sin(frame / 120) * 10}px)`,
          filter: "blur(8px)",
        }}
      />
      {new Array(160).fill(0).map((_, i) => {
        const x = random(`sx${i}`) * width;
        const y = random(`sy${i}`) * height * 0.8;
        const s = 1 + random(`ss${i}`) * 2.5;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 12) / (20 + random(`st${i}`) * 30)));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: "#fff",
              opacity: tw,
              boxShadow: `0 0 ${s * 2}px rgba(255,255,255,0.8)`,
            }}
          />
        );
      })}
      {/* silhueta do chao/horizonte */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: "14%", background: "#04060f" }} />
    </AbsoluteFill>
  );
};

// --- Bloco 2: deserto morto ao entardecer (promessa "morta") ---
const Desert: React.FC = () => {
  const frame = useCurrentFrame();
  const sun = interpolate(frame, [0, 900], [0, -30]);
  const dune = (fill: string, d: string, y: number, speed: number) => (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", bottom: y, width: "100%", transform: `translateX(${Math.sin(frame / 200) * speed}px)` }} preserveAspectRatio="none">
      <path d={d} fill={fill} />
    </svg>
  );
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#3b2412 0%,#241206 55%,#0d0602 100%)" }}>
      {/* sol baixo e fraco */}
      <div style={{ position: "absolute", top: `${45 + sun / 10}%`, left: "50%", width: 220, height: 220, marginLeft: -110, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,150,70,0.9) 0%, rgba(230,150,70,0) 70%)" }} />
      {dune("#1c1006", "M0,600 C300,480 700,720 1080,560 L1080,1920 L0,1920 Z", 0, 6)}
      {dune("#120a03", "M0,760 C400,680 800,860 1080,720 L1080,1920 L0,1920 Z", 0, 12)}
      {/* arvore seca */}
      <svg viewBox="0 0 200 300" style={{ position: "absolute", bottom: "12%", left: "62%", width: 160, opacity: 0.85 }}>
        <path d="M100,300 L100,150 M100,180 L60,120 M100,160 L140,110 M100,150 L100,80 M100,100 L70,60 M100,110 L135,70" stroke="#0a0602" strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};

// --- Bloco 3: monte com altar ao amanhecer dramatico (o teste) ---
const Mountain: React.FC = () => {
  const frame = useCurrentFrame();
  const smoke = (frame % 300) / 300;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#1a1024 0%,#3a1c1c 55%,#0e0608 100%)" }}>
      {/* brilho do amanhecer atras do pico */}
      <div style={{ position: "absolute", top: "20%", left: "50%", width: 700, height: 700, marginLeft: -350, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,170,90,0.55) 0%, rgba(240,120,60,0) 65%)", filter: "blur(10px)" }} />
      {/* montanhas em camadas */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", bottom: 0, width: "100%" }} preserveAspectRatio="none">
        <path d="M0,1100 L300,700 L560,1050 L800,650 L1080,1000 L1080,1920 L0,1920 Z" fill="#160b12" />
        <path d="M0,1300 L260,980 L520,1250 L820,950 L1080,1240 L1080,1920 L0,1920 Z" fill="#0c0509" />
      </svg>
      {/* altar + fumaca subindo */}
      <div style={{ position: "absolute", bottom: "18%", left: "50%", marginLeft: -40, width: 80, height: 50, background: "#0a0405", borderRadius: 4 }} />
      <div style={{ position: "absolute", bottom: `${22 + smoke * 20}%`, left: "50%", marginLeft: -8, width: 16, height: 60, background: "radial-gradient(circle, rgba(200,190,180,0.4) 0%, rgba(200,190,180,0) 70%)", opacity: 1 - smoke, filter: "blur(6px)" }} />
    </AbsoluteFill>
  );
};

// --- Bloco 4: amanhecer/esperanca (renasce) ---
const Dawn: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 900], [60, 20]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#0f1a24 0%,#3a2a18 55%,#e8a24c 120%)" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#132234 0%,#5a3a1e 60%,#c8863c 100%)" }} />
      {/* sol nascente */}
      <div style={{ position: "absolute", top: `${rise}%`, left: "50%", width: 300, height: 300, marginLeft: -150, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,235,180,1) 0%, rgba(255,200,120,0.6) 40%, rgba(255,200,120,0) 72%)" }} />
      {/* silhueta de colinas */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", bottom: 0, width: "100%" }} preserveAspectRatio="none">
        <path d="M0,1450 C300,1360 780,1520 1080,1400 L1080,1920 L0,1920 Z" fill="#20140a" />
      </svg>
    </AbsoluteFill>
  );
};

export const SceneArt: React.FC<{ kind: ArtKind }> = ({ kind }) => {
  if (kind === "stars") return <Stars />;
  if (kind === "desert") return <Desert />;
  if (kind === "mountain") return <Mountain />;
  return <Dawn />;
};
