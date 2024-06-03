import Readline from "readline";
import { EventBus } from "../../bus/EventBus.ts";
import { Prompt } from "./Prompt.ts";

export class Console {
    private constructor() {}
    private static _interface = Readline.createInterface({input: process.stdin, output: process.stdout});

    public static async poll(): Promise<void> {
        this.prompt("> ", (content: string) => {
            if (content === "::q" || content === "::quit") {
                this.close();
                console.log("Goodbye.");
            }
            new EventBus.Event({
                from: "Console",
                event: "UserInput",
                item: new Prompt(content)
            });
            this.poll();
            return;
        });
        return;
    }

    public static async prompt(query: string, handler: (content: string) => void): Promise<void> {
        return this._interface.question(query, handler);
    }

    public static async close(): Promise<void> {
        return this._interface.close();
    }
}