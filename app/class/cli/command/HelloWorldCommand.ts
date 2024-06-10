import type { ICommand } from "./ICommand.ts";
import { Command } from "./Command.ts";

export function HelloWorldCommand(): ICommand {
    return { ...Command(["-helloWorld"], function(args) {
        console.log("HelloWorld.");
        return;
    }) }
}