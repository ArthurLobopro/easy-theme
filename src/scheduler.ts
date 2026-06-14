import * as vscode from "vscode";
import { getCurrentTheme } from "./themes";

export type Period = "morning" | "afternoon" | "evening";

export interface SchedulerConfig {
  enabled: boolean;
  morningTheme: string;
  afternoonTheme: string;
  eveningTheme: string;
  currentTheme: string;
  morningStart: number;
  afternoonStart: number;
  eveningStart: number;
}

export function getSchedulerConfig(): SchedulerConfig {
  const cfg = vscode.workspace.getConfiguration("easy-theme");
  return {
    enabled: cfg.get<boolean>("enabled", true),
    morningTheme: cfg.get<string>("morningTheme", "Default Light Modern"),
    afternoonTheme: cfg.get<string>("afternoonTheme", "Default Dark Modern"),
    eveningTheme: cfg.get<string>("eveningTheme", "Default High Contrast"),
    morningStart: cfg.get<number>("morningStart", 6),
    afternoonStart: cfg.get<number>("afternoonStart", 12),
    eveningStart: cfg.get<number>("eveningStart", 18),
    currentTheme: getCurrentTheme()
  };
}

/**
 * Given the current hour and schedule config, returns which period is active.
 */
export function getCurrentPeriod(hour: number, config: SchedulerConfig): Period {
  const { morningStart, afternoonStart, eveningStart } = config;

  // Normalize to handle arbitrary ordering
  const periods = ([
    { name: "morning" satisfies Period, start: morningStart },
    { name: "afternoon" satisfies Period, start: afternoonStart },
    { name: "evening" satisfies Period, start: eveningStart },
  ] as const).toSorted((a, b) => a.start - b.start);

  // Walk backwards to find the last period whose start <= current hour
  let activePeriod = periods.at(-1)!.name;
  for (const period of periods) {
    if (hour >= period.start) {
      activePeriod = period.name;
    }
  }
  return activePeriod;
}

/**
 * Returns the theme name for a given period.
 */
export function getThemeForPeriod(period: Period, config: SchedulerConfig): string {
  switch (period) {
    case "morning":
      return config.morningTheme;
    case "afternoon":
      return config.afternoonTheme;
    case "evening":
      return config.eveningTheme;
  }
}

/**
 * Returns a human-readable label for a period.
 */
export function periodLabel(period: Period): string {
  switch (period) {
    case "morning":
      return "Morning ☀️";
    case "afternoon":
      return "Afternoon 🌤️";
    case "evening":
      return "Evening 🌙";
  }
}

/**
 * Calculates milliseconds until the next period change.
 * Used to schedule the next timer tick precisely.
 */
export function msUntilNextPeriodChange(config: SchedulerConfig): number {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();

  const starts = [config.morningStart, config.afternoonStart, config.eveningStart].sort(
    (a, b) => a - b
  );

  // Find the next start hour greater than current hour
  const nextStart = starts.find((h) => h > currentHour) ?? starts[0] + 24;

  const minutesUntilNextHour = 60 - currentMinutes;
  const hoursUntilNext = nextStart > currentHour
    ? nextStart - currentHour - 1
    : nextStart + 24 - currentHour - 1;

  const totalMinutes = hoursUntilNext * 60 + minutesUntilNextHour;
  const totalMs = totalMinutes * 60 * 1000 - currentSeconds * 1000;

  // Minimum 1 minute to avoid tight loops
  return Math.max(totalMs, 60_000);
}
