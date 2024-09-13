import * as Path from "path";

export interface Settings {
    configuration: ({
        alias: string;
        url: string;
        key: string;
    })[];
    contractDir: string;
    commands: ((shards: string[]) => void)[];
}

export let settings: Settings = ({
    configuration: ([{
        alias: "production",
        url: process.env?.["POLYGON_URL"]!,
        key: process.env?.["POLYGON_KEY"]!
    }]),
    contractDir: Path.join(__dirname, "../src/contract/sol/"),
    commands: ([
        shards => {
            console.log(shards);
            return;
        }
    ])
});