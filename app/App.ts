import { server } from "./class/host/Server.ts";
import { Url } from "./class/web/Url.ts";
import { message } from "./class/eventBus/EventBus.ts";
import { event } from "./class/eventBus/EventBus.ts";
import { MessageSubscription } from "./class/eventBus/EventBus.ts";
import { EventSubscription } from "./class/eventBus/EventBus.ts";
import { Directory } from "./class/host/Directory.ts";
import { Path } from "./class/host/Path.ts";
import { SolFile } from "./class/host/file/SolFile.ts";
import { join } from "path";

(async function() {

    MessageSubscription({
        message: "Boot",
    
        handler() {
            console.log("Boot");
    
            server()
                .bindRoot(Path(__dirname))
                
                .expose(
                    Url("/bytecode/:contractName"), 
                    (request, response) => {
                        switch (request.params.contractName) {
                            case "Base":
                                response
                                    .status(200)
                                    .send(SolFile(Path(join(__dirname, "./sol/Base.sol"))).unwrapOr(undefined)?.bytecode().unwrapOr(""));
                                break;
                            
                            default:
                                response
                                    .status(200)
                                    .send("unable to locate contract name");
                                break;
                        }

                        return;
                    }
                )

                .expose(
                    Url("/supportedChainIds"), 
                    (request, response) => response.send([137n])
                )

                .exposeReactApp(
                    Url("/"), 
                    Directory(Path(__dirname))
                ).unwrap()

                .boot(3000n);
        },

        once: true
    });
    
    (await message({ message: "Boot", timeout: 1000n })).unwrap();

})();