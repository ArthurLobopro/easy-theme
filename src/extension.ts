import * as vscode from "vscode";
import { ApplyNowCommand } from "./commands/ApplyNowCommand";
import { ListInstalledThemesCommand } from "./commands/ListInstalledThemesCommand";
import { ShowStatusCommand } from "./commands/ShowStatusCommand";
import { StatusbarButton } from "./StatusBarButton";
import {
  getCurrentPeriod,
  getSchedulerConfig,
  getThemeForPeriod,
  msUntilNextPeriodChange,
  periodLabel,
} from "./scheduler";
import { applyTheme, getAllInstalledThemes } from "./themes";

let schedulerTimer: ReturnType<typeof setTimeout> | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log("Easy Theme activated.");

  const button = StatusbarButton.getInstance();
  context.subscriptions.push(button);

  context.subscriptions.push(
    new ApplyNowCommand().register(),
    new ShowStatusCommand().register(),
    new ListInstalledThemesCommand().register(),
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("easy-theme")) {
        reschedule(getSchedulerConfig());
      }
    }),
  );

  reschedule();

  function reschedule(config = getSchedulerConfig()) {
    clearTimeout(schedulerTimer);

    applyThemeForCurrentTime(false);
    scheduleNextCheck();
    button.updateStatusBar(config);
  }
}

function scheduleNextCheck() {
  clearTimeout(schedulerTimer);

  const config = getSchedulerConfig();
  if (!config.enabled) {
    return;
  }

  const delay = msUntilNextPeriodChange(config);
  schedulerTimer = setTimeout(() => {
    applyThemeForCurrentTime(false);
    scheduleNextCheck();
  }, delay);
}

export async function applyThemeForCurrentTime(manual: boolean) {
  const config = getSchedulerConfig();

  if (!config.enabled) {
    if (manual) {
      vscode.window.showInformationMessage(
        "Easy Theme is disabled. Enable it in settings.",
      );
    }
    return;
  }

  const hour = new Date().getHours();
  const period = getCurrentPeriod(hour, config);
  const theme = getThemeForPeriod(period, config);

  if (!theme) return;

  const applied = await applyTheme(theme);

  StatusbarButton.getInstance().updateStatusBar();

  if (manual && applied) {
    vscode.window.showInformationMessage(
      `Easy Theme: Applied "${theme}" for ${periodLabel(period).toLowerCase()}.`,
    );
  }
}

export function deactivate() {
  clearTimeout(schedulerTimer);
}
