import * as vscode from "vscode";
import { buildAquariumHtml, postConfig } from "./webviewHtml";

/** Provides the aquarium as a WebviewView docked in the Explorer sidebar. */
export class AquariumViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = "asciiAquarium.view";

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(view: vscode.WebviewView): void {
    const media = vscode.Uri.joinPath(this.extensionUri, "media");
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [media],
    };
    view.webview.html = buildAquariumHtml(view.webview, this.extensionUri);
    postConfig(view.webview);

    // Rebuild config when the view becomes visible again (e.g. after collapse).
    view.onDidChangeVisibility(() => {
      if (view.visible) postConfig(view.webview);
    });
  }
}
