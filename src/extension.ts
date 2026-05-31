import * as vscode from "vscode";
import { AquariumPanel } from "./panel";
import { AquariumViewProvider } from "./view";

export function activate(ctx: vscode.ExtensionContext): void {
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  status.text = "$(symbol-misc) 🐟 Aquarium";
  status.command = "asciiAquarium.toggle";
  status.tooltip = "Toggle ASCII Aquarium";
  status.show();
  ctx.subscriptions.push(status);

  ctx.subscriptions.push(
    vscode.commands.registerCommand("asciiAquarium.toggle", () => AquariumPanel.toggle(ctx))
  );

  // Sidebar aquarium docked in the Explorer container.
  ctx.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      AquariumViewProvider.viewType,
      new AquariumViewProvider(ctx.extensionUri)
    )
  );
}

export function deactivate(): void {}
