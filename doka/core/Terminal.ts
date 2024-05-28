import Readline from "readline";
import { Streamer } from "./Streamer.ts";
import { Prompt } from "./Prompt.ts";

class Terminal extends Streamer {
    private _interface = Readline.createInterface({input: process.stdin, output: process.stdout});

    public constructor() {
        super("terminal");
    }

    public async poll(): Promise<void> {
        this._prompt(">", (content: string) => {
            if (content === "::q" || content === "::quit") {
                this._close();
                console.log("Goodbye.");
            }
            this.dispatchEvent("userInput", new Prompt(content));
            this.poll();
        });
        return;
    }

    private async _prompt(query: string, hook: (content: string) => void): Promise<void> {
        return this._interface.question(query, hook);
    }

    private async _close(): Promise<void> {
        return this._interface.close();
    }
}

export { Terminal };