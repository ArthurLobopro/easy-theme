
import * as vscode from "vscode";

export abstract class Command {
    abstract name: string;
    abstract exec(): void;

    register(): vscode.Disposable {
        return vscode.commands.registerCommand(this.name, () => this.exec());
    }
}