# Easy Theme 🎨

Easy Theme is a VS Code extension that automatically switches your theme based on the time of day. Perfect for keeping your workspace comfortable, whether you prefer light themes in the morning or dark, high-contrast themes late at night.

## Features

- **Automatic Theme Switching**: Seamlessly transitions between three configurable periods: Morning, Afternoon, and Evening.
- **Customizable Schedule**: You decide when each period starts.
- **Status Bar Integration**: Quickly see which period is active and which theme is applied right from your status bar.
- **Manual Override**: Force a theme update based on the current time with a single command.

## How it Works

The extension divides the day into three periods:

1.  **Morning ☀️**: Ideal for light themes.
2.  **Afternoon 🌤️**: Good for transitioning to slightly darker themes or staying light.
3.  **Evening 🌙**: Perfect for dark or high-contrast themes to reduce eye strain.

At the start of each period, Easy Theme automatically updates your `workbench.colorTheme` setting.

## Configuration

You can customize the themes and start times in your VS Code settings (`settings.json`).

| Setting | Description | Default |
| :--- | :--- | :--- |
| `easy-theme.enabled` | Enable or disable automatic switching. | `true` |
| `easy-theme.morningStart` | Hour when morning begins (0-23). | `6` (6 AM) |
| `easy-theme.morningTheme` | Theme for the morning period. | `Default Light Modern` |
| `easy-theme.afternoonStart` | Hour when afternoon begins (0-23). | `12` (12 PM) |
| `easy-theme.afternoonTheme` | Theme for the afternoon period. | `Default Dark Modern` |
| `easy-theme.eveningStart` | Hour when evening begins (0-23). | `18` (6 PM) |
| `easy-theme.eveningTheme` | Theme for the evening period. | `Default High Contrast` |

## Commands

Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for:

- **Easy Theme: Apply Theme for Current Time**: Manually triggers the theme switch based on the current hour.
- **Easy Theme: Show Current Status**: Shows a message with the current period and applied theme.
- **Easy Theme: List Installed Themes**: Lists all themes currently available in your VS Code instance (useful for finding the exact name to use in settings).

## Usage

1.  Install the extension.
2.  Open your settings and search for "Easy Theme".
3.  Set your preferred themes for each period.
4.  Optionally adjust the start hours.
