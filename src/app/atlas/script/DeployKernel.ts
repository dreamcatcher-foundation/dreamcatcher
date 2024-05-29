import { type BaseContract } from "ethers";
import { SolFile } from "@atlas/shared/os/SolFile.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Url } from "@atlas/shared/web/Url.ts";
import { Secret } from "@atlas/shared/os/Secret.ts";
import { Result } from "ts-results";

// test https://rpc.tenderly.co/fork/03e55f5f-556a-4e77-befd-3db0d1761695
// mainnet https://polygon-rpc.com
class App {    
    public static async run() {
        let rpcUrl: Url = new Url("https://rpc.tenderly.co/fork/03e55f5f-556a-4e77-befd-3db0d1761695");
        let signer: Secret = new Secret("polygonSigner");
        if (signer.fetch().none) {
            console.error("App: failed to find signer key in '.env'");
            return;
        }
        let authFacet = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("AuthFacet", await authFacet.getAddress());
        let facetRouterFacet = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/facetRouter/FacetRouterFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("FacetRouterFacet", await facetRouterFacet.getAddress());
        let tokenFacet = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("TokenFacet", await tokenFacet.getAddress());
        let tokenMintFacet = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenMintFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("TokenMintFacet", await tokenMintFacet.getAddress());
        let tokenBurnFacet = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenBurnFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("TokenBurnFacet", await tokenBurnFacet.getAddress());
        let tokenSetterFacet = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("TokenSetterFacet", await tokenSetterFacet.getAddress());
        let kernelDiamond = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/Diamond.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("KernelDiamond", await kernelDiamond.getAddress());
        console.log(
            (await kernelDiamond.getFunction().)
        )

        let response = await kernelDiamond.getFunction("install")(await authFacet.getAddress());
        console.log((await response.wait()).status);
        await kernelDiamond.getFunction("install")(await facetRouterFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenBurnFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenMintFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenSetterFacet.getAddress());
    }
}

App.run();