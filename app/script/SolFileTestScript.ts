import { SolFile } from "../class/host/file/SolFile.ts";
import { Path } from "../class/host/Path.ts";

(async function() {
    console.log("compiling");
    let sol = SolFile(Path("app/sol/base/Base.sol"));
    console.log(sol.unwrap().content().unwrap().toString("utf8"));
})();