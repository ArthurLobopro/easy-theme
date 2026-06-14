import * as vscode from "vscode";

export const VSCODE_BUILTIN_THEMES: readonly string[] = [
  // Dark
  "Default Dark Modern",
  "Default Dark+",
  "Visual Studio Dark",
  "Kimbie Dark",
  "Monokai",
  "Monokai Dimmed",
  "Red",
  "Solarized Dark",
  "Tomorrow Night Blue",
  "Abyss",
  // Light
  "Default Light Modern",
  "Default Light+",
  "Visual Studio Light",
  "Quiet Light",
  "Solarized Light",
  // High Contrast
  "Default High Contrast",
  "Default High Contrast Light",
] as const;


export function getAllInstalledThemes(): string[] {
  const fromExtensions = vscode.extensions.all
    .flatMap((ext) => {
      const themes: any[] = ext.packageJSON?.contributes?.themes ?? [];
      return themes.map((t) => (t.label as string) ?? (t.id as string));
    })
    .filter(Boolean);

  return [...new Set([...VSCODE_BUILTIN_THEMES, ...fromExtensions])];
}

/**
 * Applies a given theme by name via workbench.colorTheme setting.
 * Returns false if the theme name is not found.
 */
export async function applyTheme(themeName: string): Promise<boolean> {
  const allThemes = getAllInstalledThemes();

  if (!allThemes.includes(themeName)) {
    vscode.window.showWarningMessage(
      `Theme Scheduler: Theme "${themeName}" not found. ` +
      `Check your settings or run "List Installed Themes".`
    );
    return false;
  }

  const config = vscode.workspace.getConfiguration("workbench");
  await config.update(
    "colorTheme",
    themeName,
    vscode.ConfigurationTarget.Global
  );
  return true;
}

export function getCurrentTheme(): string {
  return vscode.workspace
    .getConfiguration("workbench")
    .get<string>("colorTheme", "Default Dark Modern");
}
