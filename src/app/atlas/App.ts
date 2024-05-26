import { SolFile } from "@atlas/shared/os/SolFile.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Host } from "@atlas/shared/web/Host.ts";
import { Url } from "@atlas/shared/web/Url.ts";
import { Directory } from "@atlas/shared/os/Directory.ts";
import { join } from "path";

interface IContractMaterial {
    errors: string[];
    warnings: string[];
    bytecode: string[];
    abi: object[] | string[];
    methods: object;
}

class App {
    public static async run(): Promise<void> {
        let contracts: Map<string, IContractMaterial | undefined> = new Map();

        (function() {
            let clientContractFile: SolFile = new SolFile(new Path(join(__dirname, "./sol/solidstate/client/Client.sol")));
            if (!clientContractFile.isBroken()) {
                contracts.set("Client", {
                    errors: clientContractFile.errors().unwrapOr([]),
                    warnings: clientContractFile.warnings().unwrapOr([]),
                    bytecode: [clientContractFile.bytecode().unwrapOr("")],
                    abi: clientContractFile.abi().unwrapOr([]),
                    methods: clientContractFile.methods().unwrapOr({})
                });
            }
        })();

        Host.expose(
            new Url("/material/:contractId"),
            function(request, response) {
                switch (request.params.contractId) {
                    case "client":
                        let material: IContractMaterial | undefined = contracts.get("Client");
                        if (!material) {
                            return response.send("Unable to find contractId");
                        }
                        return response.send({
                            errors: material.errors,
                            warnings: material.warnings,
                            bytecode: material.bytecode,
                            abi: material.abi,
                            methods: material.methods
                        });
                    default:
                        return response.send("Unable to find contractId");
                }
            }
        )

        Host.expose(
            new Url("/supportedChainIds"),
            function(request, response) {
                return response.send([
                    137
                ]);
            }
        )
        
        Host.exposeReactApp(
            new Directory(
                new Path(__dirname)
            ),
            new Url("/")
        );
        
        Host.boot();
        
    }
}

App.run();