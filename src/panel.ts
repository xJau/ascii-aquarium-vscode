import * as vscode from "vscode";
import { buildAquariumHtml, postConfig } from "./webviewHtml";

export class AquariumPanel {
  static current: AquariumPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];

  static toggle(ctx: vscode.ExtensionContext): void {
    if (AquariumPanel.current) { AquariumPanel.current.panel.dispose(); return; }
    const panel = vscode.window.createWebviewPanel(
      "asciiAquarium", "ASCII Aquarium", vscode.ViewColumn.Active,
      { enableScripts: true, retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(ctx.extensionUri, "media")] }
    );
    AquariumPanel.current = new AquariumPanel(panel, ctx);
  }

  private constructor(panel: vscode.WebviewPanel, ctx: vscode.ExtensionContext) {
    this.panel = panel;
    const w = panel.webview;
    w.html = buildAquariumHtml(w, ctx.extensionUri);
    postConfig(w);

    panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  private dispose(): void {
    AquariumPanel.current = undefined;
    while (this.disposables.length) this.disposables.pop()?.dispose();
  }
}
