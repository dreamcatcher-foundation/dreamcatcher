import type { ISolFile } from "@HarukaToolkitBundle";
import { Path } from "@HarukaToolkitBundle";
import { Url } from "@HarukaToolkitBundle";
import { host } from "@HarukaToolkitBundle";
import { SolFile } from "@HarukaToolkitBundle";
import { Directory } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { join } from "@HarukaToolkitBundle";

interface IContractMaterial {
    errors: string[];
    warnings: string[];
    bytecode: string[];
    abi: object[] | string[];
    methods: object;
}

let contracts: Map<string, IContractMaterial | undefined> = new Map();
(function() {
    let clientContractFileResult: Result<ISolFile, unknown> = SolFile({
        path: Path({
            string: join(__dirname, "./app/sol/native/solidstate/client/Client.sol")
        })
    });
    if (clientContractFileResult.ok) {
        let clientContractFile: ISolFile = clientContractFileResult.unwrap();
        contracts.set("client", {
            errors: clientContractFile.errors().unwrapOr([]),
            warnings: clientContractFile.warnings().unwrapOr([]),
            bytecode: [clientContractFile.bytecode().unwrapOr("")],
            abi: clientContractFile.abi().unwrapOr([]),
            methods: clientContractFile.methods().unwrapOr({})
        });
    }
})();

host().expose({
    url: Url({string: "/material/:contractName"}),
    hook(request, response) {
        switch (request.params.contractName) {
            case "client":
                let material: IContractMaterial | undefined = contracts.get("client");
                if (!material) {
                    break;
                }
                response.send({
                    errors: material.errors,
                    warnings: material.warnings,
                    bytecode: material.bytecode,
                    abi: material.abi,
                    methods: material.methods
                });
                break;
            default:
                response.send({});
                break;
        }
    }
});

host().expose({
    url: Url({string: "/supportedChainIds"}),
    hook(request, response) {
        response.send([137]);
    }
});

host().exposeReactApp({
    url: Url({string: "/"}),
    directory: Directory({
        path: Path({
            string: join(__dirname, "/app/")
        })
    })
});

host().useRoot({
    path: Path({
        string: join(__dirname, "/app/")
    })
});

host().boot({port: 3000n});