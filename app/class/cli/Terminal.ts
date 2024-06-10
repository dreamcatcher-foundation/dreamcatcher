import type { IPrompt } from "./IPrompt.ts";
import type { ICommand } from "./command/ICommand.ts";
import { Prompt } from "./Prompt.ts";
import { event } from "../eventBus/EventBus.ts";
import { matchArray } from "../util/MatchArray.ts";
import Readline from "readline";

export interface ITerminal {
    registerCommands(commands: ICommand[]): ITerminal;
    poll(): Promise<ITerminal>;
}

export const terminal = (function() {
    const _interface: Readline.Interface = Readline.createInterface({ input: process.stdin, output: process.stdout });
    const _commands: ICommand[] = [];
    let _isFirstPoll: boolean = true;
    let _: ITerminal;

    function commands(): ICommand[] {
        return _commands;
    }

    function registerCommands(commands: ICommand[]): typeof _ {
        _commands.push(...commands);
        return _;
    }

    async function poll(): Promise<typeof _> {
        if (_isFirstPoll) {
            _isFirstPoll = false;
            console.log("Welcome To Dreamcatcher CLI App.");
        }
        _prompt("", async (content: string) => {
            const prompt: IPrompt = Prompt(content);
            if (
                prompt.shards()[0] === "-q" ||
                prompt.shards()[0] === "-quit"
            ) {
                _close();
                console.log("Goodbye.");
            }

            for (let i = 0; i < commands().length; i++) {
                matchArray(prompt.commands(), commands()[i].requiredCommands()).map(match => {
                    if (match) {
                        commands()[i].run(prompt.args());
                    }
                });
            }

            event({ from: "Terminal", event: "TerminalUserInput", item: prompt });
            await poll();
            return;
        });
        return _;
    }

    function _prompt(query: string, handler: (content: string) => void): typeof _ {
        _interface.question(query, handler);
        return _;
    }

    function _close(): typeof _ {
        _interface.close();
        return _;
    }

    return function() {
        if (!_) {
            return _ = { registerCommands, poll };
        }
        return _;
    }
})();