import { Host } from "@atlas/class/host/Host.ts";
import * as FileSystem from "fs";

FileSystem.writeFileSync(
    "Node.sol", (
        new Host.SolFile(
        new Host.Path(
            "src/app/atlas/sol/Node.sol"
        )
    ).content().unwrap().toString("utf8")
));