import { type BaseContract } from "ethers";
import { SolFile } from "@atlas/shared/os/SolFile.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Url } from "@atlas/shared/web/Url.ts";
import { Secret } from "@atlas/shared/os/Secret.ts";
import { Result } from "ts-results";

// test https://rpc.tenderly.co/fork/03e55f5f-556a-4e77-befd-3db0d1761695
// mainnet https://polygon-rpc.com
class App {
    public static async run(): Promise<void> {
        let rpcUrl: Url = new Url("https://rpc.tenderly.co/fork/03e55f5f-556a-4e77-befd-3db0d1761695");
        let signer: Secret = new Secret("polygonSigner");
        if (signer.fetch().none) {
            console.error("App: failed to find signer key in '.env'");
            return;
        }
        console.log("App: deploying kernel side facets");
        let maybeAuthFacet: BaseContract | void = await this._deployFacet("AuthFacet", "src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol", rpcUrl, signer);
        let maybeClientFactoryFacet: BaseContract | void = await this._deployFacet("ClientFactoryFacet", "src/app/atlas/sol/solidstate/kernel/facet/clientFactory/ClientFactoryFacet.sol", rpcUrl, signer);
        let maybeFacetRouterFacet: BaseContract | void = await this._deployFacet("FacetRouterFacet", "src/app/atlas/sol/solidstate/kernel/facet/facetRouter/FacetRouterFacet.sol", rpcUrl, signer);
        let maybeTokenFacet: BaseContract | void = await this._deployFacet("TokenFacet", "src/app/atlas/sol/solidstate/kernel/facet/token/TokenFacet.sol", rpcUrl, signer);
        let maybeTokenBurnFacet: BaseContract | void = await this._deployFacet("TokenBurnFacet", "src/app/atlas/sol/solidstate/kernel/facet/token/TokenBurnFacet.sol", rpcUrl, signer);
        let maybeTokenMintFacet: BaseContract | void = await this._deployFacet("TokenMintFacet", "src/app/atlas/sol/solidstate/kernel/facet/token/TokenMintFacet.sol", rpcUrl, signer);
        let maybeTokenSetterFacet: BaseContract | void = await this._deployFacet("TokenSetterFacet", "src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol", rpcUrl, signer);
        let maybeKernelDiamond: BaseContract | void = await this._deployFacet("Diamond", "src/app/atlas/sol/solidstate/Diamond.sol", rpcUrl, signer);
        if (
            !maybeAuthFacet ||
            !maybeClientFactoryFacet ||
            !maybeFacetRouterFacet ||
            !maybeTokenFacet ||
            !maybeTokenBurnFacet ||
            !maybeTokenMintFacet ||
            !maybeTokenSetterFacet ||
            !maybeKernelDiamond
        ) {
            throw new Error("Failed Facet");
        }
        let authFacet: BaseContract = maybeAuthFacet;
        let clientFactoryFacet: BaseContract = maybeClientFactoryFacet;
        let facetRouterFacet: BaseContract = maybeFacetRouterFacet;
        let tokenFacet: BaseContract = maybeTokenFacet;
        let tokenBurnFacet: BaseContract = maybeTokenBurnFacet;
        let tokenMintFacet: BaseContract = maybeTokenMintFacet;
        let tokenSetterFacet: BaseContract = maybeTokenSetterFacet;
        let kernelDiamond: BaseContract = maybeKernelDiamond;
        kernelDiamond.getFunction("install")(await authFacet.getAddress());
        kernelDiamond.getFunction("install")(await clientFactoryFacet.getAddress());
        kernelDiamond.getFunction("install")(await facetRouterFacet.getAddress());
        kernelDiamond.getFunction("install")(await tokenFacet.getAddress());
        kernelDiamond.getFunction("install")(await tokenBurnFacet.getAddress());
        kernelDiamond.getFunction("install")(await tokenMintFacet.getAddress());
        kernelDiamond.getFunction("install")(await tokenSetterFacet.getAddress());
        kernelDiamond.getFunction("claimOwnership")();
        kernelDiamond.getFunction("commit")("auth", await authFacet.getAddress());
        console.log({
            authFacet: await authFacet.getAddress(),
            clientFactoryFacet: await clientFactoryFacet.getAddress(),
            facetRouterFacet: await facetRouterFacet.getAddress(),
            tokenFacet: await tokenFacet.getAddress(),
            tokenBurnFacet: await tokenBurnFacet.getAddress(),
            tokenMintFacet: await tokenMintFacet.getAddress(),
            tokenSetterFacet: await tokenSetterFacet.getAddress(),
            kernelDiamond: await kernelDiamond.getAddress()
        });
    }

    private static async _deployFacet(name: string, path: string, rpcUrl: Url, signer: Secret): Promise<BaseContract | void> {
        let deployingMessage: string = `App: deploying '${name}.sol'`;
        let severeErrorMessage: string = `App: '${name}.sol' has severe error and cannot be deployed`;
        let failedDeploymentMessage: string = `App: failed to deploy '${name}.sol'`;
        console.log(deployingMessage);
        let file: SolFile = new SolFile(new Path(path));
        if (file.errors().err) {
            console.error(severeErrorMessage);
            return;
        }
        if (file.errors().unwrap().length > 0) {
            console.error(severeErrorMessage);
            file.errors().unwrap().forEach(error => console.error(error));
            return;
        }
        file.warnings().unwrapOr([]).forEach(warning => console.warn(warning));
        let deploymentResult: Result<BaseContract, unknown> = await file.deploy(rpcUrl, signer);
        if (deploymentResult.err) {
            console.error(failedDeploymentMessage);
            return;
        }
        return deploymentResult.unwrap();
    }
}

App.run();