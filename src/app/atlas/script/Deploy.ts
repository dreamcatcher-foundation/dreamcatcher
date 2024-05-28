import { type BaseContract } from "ethers";
import { SolFile } from "@atlas/shared/os/SolFile.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Url } from "@atlas/shared/web/Url.ts";
import { Secret } from "@atlas/shared/os/Secret.ts";
import { Result } from "ts-results";

class App {
    public static async run(): Promise<void> {
        let rpcUrl: Url = new Url("https://polygon-rpc.com");
        let signer: Secret = new Secret("polygonSigner");
        let authExtensionFile: SolFile = new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/client/extension/auth/facet/AuthFacet.sol"
            )
        );
        authExtensionFile.errors().unwrapOr([]).forEach(error => console.error(error));
        let authExtensionFileDeploymentResult: Result<BaseContract, unknown> = await authExtensionFile.deploy(rpcUrl, signer);
        let authExtensionDeployedContract: BaseContract = authExtensionFileDeploymentResult.unwrap();
        let clientContractFile: SolFile = new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/client/Client.sol"
            )
        );
        let clientContractFileDeploymentResult: Result<BaseContract, unknown> = await clientContractFile.deploy(rpcUrl, signer);
        let clientContractDeployedContract: BaseContract = clientContractFileDeploymentResult.unwrap();
        await clientContractDeployedContract.getFunction("install")(await authExtensionDeployedContract.getAddress());
        await clientContractDeployedContract.getFunction("claimOwnership")();
        console.log(
            `AuthExtension -> ${authExtensionDeployedContract.getAddress()}`,
            `Client -> ${clientContractDeployedContract.getAddress()}`
        )
    }
}

App.run();