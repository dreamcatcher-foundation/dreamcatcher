import type { ICommand } from "./ICommand.ts";
import { Command } from "./Command.ts";
import { Path } from "../../host/Path.ts";
import { Url } from "../../web/Url.ts";
import { SolFile } from "../../host/file/SolFile.ts";
import { join } from "path";
import { server } from "../../host/Server.ts";
import { Directory } from "../../host/Directory.ts";

export function BootServerCommand(): ICommand {
    return { ...Command(["-serve"], async function(args) {
        server()
            .bindRoot(Path(join(__dirname, "../../../")))
            .expose(Url("/bytecode/:contractName"), function(request, response) {
                switch (request.params.contractName) {
                    case "Base":
                        response
                            .status(200)
                            .send(SolFile(Path(join(join(__dirname, "../../../"), "./sol/Base.sol"))).unwrapOr(undefined)?.bytecode().unwrapOr(""));
                        break;
                    default:
                        response
                            .status(200)
                            .send("unable to locate contract name");
                        break;
                }
                return;
            })
            .expose(Url("/supportedChainIds"), (request, response) => response.send([137n]))
            .exposeReactApp(Url("/"), Directory(Path(join(__dirname, "../../../")))).unwrap()
            .boot(3000n);
        return;
    }) }
}