import * as vscode from "vscode";
import { getAllInstalledThemes } from "../themes";
import { Command } from "./Command";

export class ListInstalledThemesCommand extends Command {
  name = "easy-theme.listInstalledThemes";

  exec() {
    const themes = getAllInstalledThemes();
    const items = themes.map((t) => ({ label: t }));

    vscode.window
      .showQuickPick(items, {
        placeHolder: "All available themes (built-in + installed extensions)",
        title: "Theme Scheduler — Installed Themes",
      })
      .then((selected) => {
        if (selected) {
          vscode.window
            .showInformationMessage(
              `Set "${selected.label}" as which period's theme?`,
              "Morning ☀️",
              "Afternoon 🌤️",
              "Evening 🌙",
            )
            .then((period) => {
              if (!period) {
                return;
              }
              const keyMap: Record<string, string> = {
                "Morning ☀️": "morningTheme",
                "Afternoon 🌤️": "afternoonTheme",
                "Evening 🌙": "eveningTheme",
              };
              const key = keyMap[period];
              vscode.workspace
                .getConfiguration("easy-theme")
                .update(key, selected.label, vscode.ConfigurationTarget.Global)
                .then(() => {
                  vscode.window.showInformationMessage(
                    `Theme Scheduler: "${selected.label}" set as ${period} theme.`,
                  );
                });
            });
        }
      });
  }
}
