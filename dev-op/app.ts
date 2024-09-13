import {Terminal} from "./console/terminal";
import {Prompt} from "./console/prompt";
import {settings} from "./settings";

(async (): Promise<void> => {
    let terminal: Terminal = Terminal();
    (async function main(): Promise<void> {
        terminal.question("dev-op ", answer => {
            let prompt: Prompt = Prompt(answer);
            let shards: string[] = prompt.shards();
            if (shards[0] === "-exit") {
                terminal.close();
                console.log("Goodbye");
                return;
            }
            for (let i = 0; i < settings.commands.length; i++) settings.commands[i](shards);
            main();
        })
    })();
    return;
})();