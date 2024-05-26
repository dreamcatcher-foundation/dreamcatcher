import readline from "readline";
import { readFileSync } from "fs";
import { writeFileSync } from "fs";

interface IDatabase {
    get(key: string): void;
    set(key: string, value: unknown): void;
}



class  {
    public constructor(private _path: string) {}

    public get(): unknown {
        return JSON.parse(readFileSync(this._path, "utf8"));
    }

    public set(item: unknown): void {
        return writeFileSync(this._path, JSON.stringify(item, null, 4), "utf8");
    }
}

class Terminal {
    private constructor() {}
    private static _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    public static question(query: string, hook: (answer: string) => void) {
        return this._interface.question(query, hook);
    }

    public static close(): void {
        return this._interface.close();
    }
}


class Prompt {
    private _shards: string[] = [];

    public constructor(string: string) {
        this._shards = string.split(" ");
    }

    public shards(): string[] {
        return this._shards;
    }
}

class App {
    public static run(): void {
        new Database

        Terminal.question("Shell", (string: string) => {
            let prompt: Prompt = new Prompt(string);

            if (string === "-exit") {
                Terminal.close();
                console.log("Goodbye");
            }
            else {
                App.run();
            }
        });
    }
}

App.run();