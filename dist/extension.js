"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  applyThemeForCurrentTime: () => applyThemeForCurrentTime,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode7 = __toESM(require("vscode"));

// src/commands/Command.ts
var vscode = __toESM(require("vscode"));
var Command = class {
  register() {
    return vscode.commands.registerCommand(this.name, () => this.exec());
  }
};

// src/commands/ApplyNowCommand.ts
var ApplyNowCommand = class extends Command {
  name = "easy-theme.applyNow";
  exec() {
    applyThemeForCurrentTime(true);
  }
};

// src/commands/ListInstalledThemesCommand.ts
var vscode3 = __toESM(require("vscode"));

// src/themes.ts
var vscode2 = __toESM(require("vscode"));
var VSCODE_BUILTIN_THEMES = [
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
  "Default High Contrast Light"
];
function getAllInstalledThemes() {
  const fromExtensions = vscode2.extensions.all.flatMap((ext) => {
    const themes = ext.packageJSON?.contributes?.themes ?? [];
    return themes.map((t) => t.label ?? t.id);
  }).filter(Boolean);
  return [.../* @__PURE__ */ new Set([...VSCODE_BUILTIN_THEMES, ...fromExtensions])];
}
async function applyTheme(themeName) {
  const allThemes = getAllInstalledThemes();
  if (!allThemes.includes(themeName)) {
    vscode2.window.showWarningMessage(
      `Theme Scheduler: Theme "${themeName}" not found. Check your settings or run "List Installed Themes".`
    );
    return false;
  }
  const config = vscode2.workspace.getConfiguration("workbench");
  await config.update(
    "colorTheme",
    themeName,
    vscode2.ConfigurationTarget.Global
  );
  return true;
}
function getCurrentTheme() {
  return vscode2.workspace.getConfiguration("workbench").get("colorTheme", "Default Dark Modern");
}

// src/commands/ListInstalledThemesCommand.ts
var ListInstalledThemesCommand = class extends Command {
  name = "easy-theme.listInstalledThemes";
  exec() {
    const themes = getAllInstalledThemes();
    const items = themes.map((t) => ({ label: t }));
    vscode3.window.showQuickPick(items, {
      placeHolder: "All available themes (built-in + installed extensions)",
      title: "Theme Scheduler \u2014 Installed Themes"
    }).then((selected) => {
      if (selected) {
        vscode3.window.showInformationMessage(
          `Set "${selected.label}" as which period's theme?`,
          "Morning \u2600\uFE0F",
          "Afternoon \u{1F324}\uFE0F",
          "Evening \u{1F319}"
        ).then((period) => {
          if (!period) {
            return;
          }
          const keyMap = {
            "Morning \u2600\uFE0F": "morningTheme",
            "Afternoon \u{1F324}\uFE0F": "afternoonTheme",
            "Evening \u{1F319}": "eveningTheme"
          };
          const key = keyMap[period];
          vscode3.workspace.getConfiguration("easy-theme").update(key, selected.label, vscode3.ConfigurationTarget.Global).then(() => {
            vscode3.window.showInformationMessage(
              `Theme Scheduler: "${selected.label}" set as ${period} theme.`
            );
          });
        });
      }
    });
  }
};

// src/commands/ShowStatusCommand.ts
var vscode5 = __toESM(require("vscode"));

// src/scheduler.ts
var vscode4 = __toESM(require("vscode"));
function getSchedulerConfig() {
  const cfg = vscode4.workspace.getConfiguration("easy-theme");
  return {
    enabled: cfg.get("enabled", true),
    morningTheme: cfg.get("morningTheme", "Default Light Modern"),
    afternoonTheme: cfg.get("afternoonTheme", "Default Dark Modern"),
    eveningTheme: cfg.get("eveningTheme", "Default High Contrast"),
    morningStart: cfg.get("morningStart", 6),
    afternoonStart: cfg.get("afternoonStart", 12),
    eveningStart: cfg.get("eveningStart", 18),
    currentTheme: getCurrentTheme()
  };
}
function getCurrentPeriod(hour, config) {
  const { morningStart, afternoonStart, eveningStart } = config;
  const periods = [
    { name: "morning", start: morningStart },
    { name: "afternoon", start: afternoonStart },
    { name: "evening", start: eveningStart }
  ].toSorted((a, b) => a.start - b.start);
  let activePeriod = periods.at(-1).name;
  for (const period of periods) {
    if (hour >= period.start) {
      activePeriod = period.name;
    }
  }
  return activePeriod;
}
function getThemeForPeriod(period, config) {
  switch (period) {
    case "morning":
      return config.morningTheme;
    case "afternoon":
      return config.afternoonTheme;
    case "evening":
      return config.eveningTheme;
  }
}
function periodLabel(period) {
  switch (period) {
    case "morning":
      return "Morning \u2600\uFE0F";
    case "afternoon":
      return "Afternoon \u{1F324}\uFE0F";
    case "evening":
      return "Evening \u{1F319}";
  }
}
function msUntilNextPeriodChange(config) {
  const now = /* @__PURE__ */ new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const starts = [config.morningStart, config.afternoonStart, config.eveningStart].sort(
    (a, b) => a - b
  );
  const nextStart = starts.find((h) => h > currentHour) ?? starts[0] + 24;
  const minutesUntilNextHour = 60 - currentMinutes;
  const hoursUntilNext = nextStart > currentHour ? nextStart - currentHour - 1 : nextStart + 24 - currentHour - 1;
  const totalMinutes = hoursUntilNext * 60 + minutesUntilNextHour;
  const totalMs = totalMinutes * 60 * 1e3 - currentSeconds * 1e3;
  return Math.max(totalMs, 6e4);
}

// src/commands/ShowStatusCommand.ts
var ShowStatusCommand = class extends Command {
  name = "easy-theme.showStatus";
  exec() {
    const config = getSchedulerConfig();
    const hour = (/* @__PURE__ */ new Date()).getHours();
    const period = getCurrentPeriod(hour, config);
    const theme = getThemeForPeriod(period, config);
    const lines = [
      `**Theme Scheduler** \u2014 ${config.enabled ? "Enabled \u2705" : "Disabled \u274C"}`,
      "",
      `**Current period:** ${periodLabel(period)} (${theme})`,
      "",
      "**Schedule:**",
      `- ${periodLabel("morning")} from ${pad(config.morningStart)}:00 \u2192 \`${config.morningTheme ?? "Not Setted"}\``,
      `- ${periodLabel("afternoon")} from ${pad(config.afternoonStart)}:00 \u2192 \`${config.afternoonTheme ?? "Not Setted"}\``,
      `- ${periodLabel("evening")} from ${pad(config.eveningStart)}:00 \u2192 \`${config.eveningTheme ?? "Not Setted"}\``
    ].join("\n");
    vscode5.window.showInformationMessage(lines, { modal: true }, "Apply Now").then(
      (selection) => {
        if (selection === "Apply Now") {
          applyThemeForCurrentTime(true);
        }
      }
    );
  }
};
function pad(n) {
  return String(n).padStart(2, "0");
}

// src/StatusBarButton.ts
var vscode6 = __toESM(require("vscode"));
var StatusbarButton = class _StatusbarButton {
  disposables;
  button;
  static instance = null;
  constructor() {
    const button = vscode6.window.createStatusBarItem(vscode6.StatusBarAlignment.Right, 150);
    button.name = "$(color-mode)";
    button.command = "easy-theme.showStatus";
    button.tooltip = "Theme Scheduler \u2014 click for details";
    this.button = button;
    this.disposables = [button];
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new _StatusbarButton();
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
};

// src/extension.ts
var schedulerTimer;
function activate(context) {
  console.log("Theme Scheduler activated.");
  const button = StatusbarButton.getInstance();
  context.subscriptions.push(button);
  context.subscriptions.push(
    new ApplyNowCommand().register(),
    new ShowStatusCommand().register(),
    new ListInstalledThemesCommand().register()
  );
  context.subscriptions.push(
    vscode7.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("easy-theme")) {
        reschedule(getSchedulerConfig());
      }
    })
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
async function applyThemeForCurrentTime(manual) {
  const config = getSchedulerConfig();
  if (!config.enabled) {
    if (manual) {
      vscode7.window.showInformationMessage(
        "Theme Scheduler is disabled. Enable it in settings."
      );
    }
    return;
  }
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const period = getCurrentPeriod(hour, config);
  const theme = getThemeForPeriod(period, config);
  const applied = await applyTheme(theme);
  StatusbarButton.getInstance().updateStatusBar();
  if (manual && applied) {
    vscode7.window.showInformationMessage(
      `Theme Scheduler: Applied "${theme}" for ${periodLabel(period).toLowerCase()}.`
    );
  }
}
function deactivate() {
  clearTimeout(schedulerTimer);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  applyThemeForCurrentTime,
  deactivate
});
//# sourceMappingURL=extension.js.map
