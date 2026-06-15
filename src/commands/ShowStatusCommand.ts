import * as vscode from "vscode";
import { applyThemeForCurrentTime } from "../extension";
import {
  getCurrentPeriod,
  getSchedulerConfig,
  getThemeForPeriod,
  periodLabel,
} from "../scheduler";
import { Command } from "./Command";

export class ShowStatusCommand extends Command {
  name = "easy-theme.showStatus";

  exec() {
    const config = getSchedulerConfig();
    const hour = new Date().getHours();
    const period = getCurrentPeriod(hour, config);
    const theme = getThemeForPeriod(period, config);

    const { morningTheme, afternoonTheme, eveningTheme } = config;

    const lines = [
      `Theme Scheduler — ${config.enabled ? "Enabled ✅" : "Disabled ❌"}`,
      "",
      `Current period: ${periodLabel(period)} (${theme})`,
      "",
      "Schedule:",
      `- ${periodLabel("morning")} from ${pad(config.morningStart)}:00 → ${themeLabel(morningTheme)}`,
      `- ${periodLabel("afternoon")} from ${pad(config.afternoonStart)}:00 → ${themeLabel(afternoonTheme)}`,
      `- ${periodLabel("evening")} from ${pad(config.eveningStart)}:00 → ${themeLabel(eveningTheme)}`,
    ].join("\n");

    vscode.window
      .showInformationMessage(lines, { modal: true }, "Apply Now")
      .then((selection) => {
        if (selection === "Apply Now") {
          applyThemeForCurrentTime(true);
        }
      });
  }
}

function themeLabel(theme: string | null) {
  return theme ? `(${theme})` : "Not Setted";
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
