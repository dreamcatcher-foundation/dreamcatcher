import { Terminal } from "./core/Terminal.ts";
import { Streamer } from "./core/Streamer.ts";
import { Prompt } from "./core/Prompt.ts";
import { SolFile } from "../src/app/atlas/shared/os/SolFile.ts";

new Streamer("").createEventSubscription("terminal", "userInput", function(item?: unknown) {
    if (item instanceof Prompt) {
        let prompt: Prompt = item;
        if (prompt.shards()[0] === "::bytecode") {
            let path: string = prompt.shards()[1];
            let solFile: SolFile = new SolFile(path);
            console.log(solFile.bytecode());
        }
    }
});

class App {
    public static async run() {
        new Terminal().poll();
    }
}

App.run();