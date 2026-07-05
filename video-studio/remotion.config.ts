import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Chromium ja vem instalado no ambiente (Playwright). Aponta pra ele para nao baixar de novo.
if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
  try {
    Config.setBrowserExecutable(process.env.REMOTION_CHROME || undefined as unknown as string);
  } catch (e) {
    // ignora se a versao do Config nao suportar
  }
}
