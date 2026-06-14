import { applyThemeForCurrentTime } from "../extension";
import { Command } from "./Command";

export class ApplyNowCommand extends Command {
    name = "easy-theme.applyNow";

    exec() {
        applyThemeForCurrentTime(true);
    }
}