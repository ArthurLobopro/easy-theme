import * as vscode from "vscode";
import { getSchedulerConfig } from "./scheduler";

export class StatusbarButton implements vscode.Disposable {
  disposables: vscode.Disposable[];
  private button: vscode.StatusBarItem;

  private static instance: StatusbarButton | null = null;

  private constructor() {
    const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 150);
    button.name = "$(color-mode)";
    button.command = "easy-theme.showStatus";
    button.tooltip = "Theme Scheduler — click for details";

    this.button = button;
    this.disposables = [button];
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new StatusbarButton();

    return this.instance;
  }

  updateStatusBar(config = getSchedulerConfig()) {
    this.button.text = `$(color-mode) ${config.currentTheme}`;
    this.button.show();
  }

  dispose() {
    this.disposables.forEach((disposable) => {
      disposable.dispose();
    });
  }
}