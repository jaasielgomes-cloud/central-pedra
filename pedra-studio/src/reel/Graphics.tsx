import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, RADIUS, TYPO } from "../theme/tokens";
import { EASE, SPRING } from "../theme/motion";
import { KineticTitle } from "../components/text/KineticTitle";

// Gráficos de "prova" que interrompem o padrão visual (estilo documentário Penin/Abraham).
// Todos ocupam a metade de cima: a legenda (63%) continua legível embaixo.

const Dim: React.FC<{ o?: number }> = ({ o = 0.72 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `rgba(6,8,10,${interpolate(f, [0, 5], [0, o], { extrapolateRight: "clamp" })})`, backdropFilter: "blur(6px)" }} />;
};

// Print de notícia/documento com marca-texto passando na frase-chave.
export const Manchete: React.FC<{ fonte: string; texto: string; destaque: string }> = ({ fonte, texto, destaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: SPRING.settle });
  const marker = interpolate(frame, [10, 26], [0, 100], { easing: EASE.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = 1 + frame * 0.0015; // aproximação lenta = tensão
  const [antes, depois] = texto.includes(destaque) ? texto.split(destaque) : [texto + " ", ""];
  return (
    <AbsoluteFill>
      <Dim />
      <div
        style={{
          position: "absolute", top: 260, left: 70, right: 70, padding: "46px 50px",
          background: COLORS.limestone, borderRadius: RADIUS.md, boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) rotate(${interpolate(p, [0, 1], [3, -1.2])}deg) scale(${zoom})`,
          opacity: p,
        }}
      >
        <div style={{ fontFamily: TYPO.family.body, fontSize: 28, fontWeight: 700, letterSpacing: 3, color: COLORS.signalDeep, textTransform: "uppercase", marginBottom: 18 }}>
          {fonte}
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 58, lineHeight: 1.2, fontWeight: 700, color: COLORS.ink }}>
          {antes}
          <span style={{ backgroundImage: `linear-gradient(transparent 55%, #FFD60A 55%)`, backgroundSize: `${marker}% 100%`, backgroundRepeat: "no-repeat" }}>
            {destaque}
          </span>
          {depois}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Numero: React.FC<{ valor: number; rotulo: string; prefixo?: string; sufixo?: string }> = ({ valor, rotulo, prefixo = "", sufixo = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [0, 24], [0, valor], { easing: EASE.out, extrapolateRight: "clamp" });
  const pop = spring({ frame: frame - 24, fps, config: SPRING.pop }); // "trava" no valor final
  const casas = Number.isInteger(valor) ? 0 : 1;
  return (
    <AbsoluteFill>
      <Dim o={0.62} />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: TYPO.family.display, fontWeight: 900, fontSize: 250, lineHeight: 1, color: COLORS.white, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.08 * Math.sin(Math.min(1, pop) * Math.PI)})`, textShadow: "0 10px 60px rgba(0,0,0,0.6)" }}>
          {prefixo}{v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}
          <span style={{ color: COLORS.signal }}>{sufixo}</span>
        </div>
        <div style={{ marginTop: 18, fontFamily: TYPO.family.body, fontWeight: 700, fontSize: 40, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.limestone }}>
          {rotulo}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Cartela de capítulo: tela escura, kicker vermelho, título cinético.
export const Titulo: React.FC<{ texto: string; kicker?: string }> = ({ texto, kicker }) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 14], [0, 160], { easing: EASE.out, extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: COLORS.ink, justifyContent: "center", padding: "0 90px", gap: 28 }}>
      {kicker && (
        <div style={{ fontFamily: TYPO.family.mono, fontSize: 34, letterSpacing: "0.3em", color: COLORS.signal, textTransform: "uppercase" }}>
          {kicker}
        </div>
      )}
      <div style={{ height: 8, width: line, background: COLORS.signal }} />
      <KineticTitle text={texto} size="h1" step={3} />
    </AbsoluteFill>
  );
};
