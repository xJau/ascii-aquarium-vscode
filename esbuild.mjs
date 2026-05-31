import { build } from "esbuild";
await build({
  entryPoints: ["src/webview/main.ts"],
  bundle: true,
  format: "iife",
  platform: "browser",
  outfile: "media/main.js",
  logLevel: "info",
});
