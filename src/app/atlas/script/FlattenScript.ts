import { Host } from "@atlas/class/host/Host.ts";
import * as FileSystem from "fs";

FileSystem.writeFileSync(
    "F.sol", (
        new Host.SolFile(
        new Host.Path(
            "src/app/atlas/sol/class/kernel/adminNode/AdminNodePlugIn.sol"
        )
    ).content().unwrap().toString("utf8")
));