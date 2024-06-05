import { Host } from "./class/host/Host.ts";
import { join } from "path";
import { Url } from "./class/web/Url.ts";

abstract class IContractMaterial {
    public abstract errors: string[];
    public abstract warnings: string[];
    public abstract bytecode: string[];
    public abstract abi:
        | object[]
        | string[];
    public abstract methods: object;
}

class App {
    public static async run(): Promise<void> {
        let contracts: Map<string, IContractMaterial | undefined> = new Map();

        (function() {
            let file: Host.ISolFile = new Host.SolFile(new Host.Path(join(__dirname, "./sol/solidstate/client/Client.sol")));
            if (!file.isBroken()) {
                contracts.set("Client", {
                    errors: file.errors().unwrapOr([]),
                    warnings: file.warnings().unwrapOr([]),
                    bytecode: [file.bytecode().unwrapOr("")],
                    abi: file.abi().unwrapOr([]),
                    methods: file.methods().unwrapOr([])
                });
            }
        })();

        Host.Server
            .expose(
                new Url("/material/:contractId"),
                (request, response) => {
                    switch (request.params.contractId) {
                        case "client":
                            let material: IContractMaterial | undefined = contracts.get("Client");
                            if (!material) {
                                return response.send("App::UnableToFindContractId");
                            }
                            return response.send({
                                errors: material.errors,
                                warnings: material.warnings,
                                bytecode: material.bytecode,
                                abi: material.abi,
                                methods: material.methods
                            });
                        default:
                            return response.send("App::UnableToFindContractId");
                    }
                }
            )

            .expose(
                new Url("./supportedChainIds"),
                (request, response) => {
                    return response.send([
                        137n
                    ]);
                }
            )

            .exposeReactApp(
                new Host.Directory(
                    new Host.Path(__dirname)
                ),
                new Url("/")
            ).unwrap()

            .boot(3000n);
    }
}

App.run();