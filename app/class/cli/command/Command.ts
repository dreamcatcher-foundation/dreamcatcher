import type { ICommand } from "./ICommand.ts";

export function Command(_commands: string[], _hook: (args: unknown[]) => void | Promise<void>): ICommand {
    let _: ICommand = { requiredCommands, run };

    function requiredCommands(): string[] {
        return _commands;
    }

    async function run(args: unknown[]): Promise<void> {
        return _hook(args);
    }

    return _;
}