import { staticFile, continueRender, delayRender } from "remotion";

// Embute as fontes locais (offline-safe no render). Ver PEDRA MOTION OS → 09/02 Tipografia.
let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("carregando-fontes");
  const defs: [string, string, number][] = [
    ["Archivo", "fonts/Archivo.ttf", 900],
    ["Inter", "fonts/Inter.ttf", 400],
    ["Space Grotesk", "fonts/SpaceGrotesk.ttf", 700],
  ];
  const css = defs
    .map(
      ([name, path, w]) =>
        `@font-face{font-family:'${name}';src:url('${staticFile(
          path
        )}') format('truetype');font-weight:100 900;font-display:block;}`
    )
    .join("\n");
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  // aquece o cache do navegador
  Promise.all(
    defs.map(([name, , w]) => (document as any).fonts.load(`${w} 100px '${name}'`))
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
