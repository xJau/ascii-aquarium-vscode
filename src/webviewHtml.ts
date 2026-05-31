import * as vscode from "vscode";

/**
 * Build the aquarium webview HTML for either an editor panel or a sidebar view.
 * Reads media/index.html and wires up the script/style URIs + CSP source.
 */
export function buildAquariumHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const media = vscode.Uri.joinPath(extensionUri, "media");
  const script = webview.asWebviewUri(vscode.Uri.joinPath(media, "main.js"));
  const style = webview.asWebviewUri(vscode.Uri.joinPath(media, "style.css"));
  return require("fs")
    .readFileSync(vscode.Uri.joinPath(media, "index.html").fsPath, "utf8")
    .replace("__SCRIPT__", script.toString())
    .replace("__STYLE__", style.toString())
    .replace(/__CSPSOURCE__/g, webview.cspSource);
}

/** Push the current configuration to a webview so it can (re)build the aquarium. */
export function postConfig(webview: vscode.Webview): void {
  const cfg = vscode.workspace.getConfiguration("asciiAquarium");
  webview.postMessage({
    cmd: "config",
    fps: cfg.get("targetFps", 16),
    feedEnabled: cfg.get("feedEnabled", true),
    enabledEvents: cfg.get("enabledEvents", []),
  });
}
