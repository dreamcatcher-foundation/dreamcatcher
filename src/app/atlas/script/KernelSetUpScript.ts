import { Host } from "@atlas/class/host/Host.ts";
import { ethers as Ethers } from "ethers";

class KernelSetUpScript {
    private constructor() {}

    public static async run(): Promise<void> {
        let rpcUrl: string = "https://polygon-rpc.com";
        let privateKey: Host.ISecret = new Host.Secret("polygonPrivateKey");
        if (privateKey.resolve().none) {
            console.log("KernelSetUpScript::MissingPrivateKey");
            return;
        }
        console.log(`Deploying...`);
        /// NOTE Deploying Diamond Launcher because the inbuilt factory
        ///      exceeds the size limit.
        let diamondLauncher: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/auth/DiamondLauncher.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`DiamondLauncher ${diamondLauncher}`);
        let authFacet: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`AuthFacet ${authFacet}`);
        let facetRouterFacet: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/facetRouter/FacetRouterFacet.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`FacetRouterFacet ${facetRouterFacet}`);
        let tokenFacet: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/token/TokenFacet.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`TokenFacet ${tokenFacet}`);
        let tokenMintFacet: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/token/TokenMintFacet.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`TokenMintFacet ${tokenMintFacet}`);
        let tokenBurnFacet: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/token/TokenBurnFacet.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`TokenBurnFacet ${tokenBurnFacet}`);
        let tokenSetterFacet: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`TokenSetterFacet ${tokenSetterFacet}`);
        let clientFactoryFacet: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/kernel/facet/clientFactory/ClientFactoryFacet.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`ClientFactoryFacet ${clientFactoryFacet}`);
        let kernel: string = ((await new Host.ConstructorTransaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path("src/app/atlas/sol/solidstate/Diamond.sol")),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
        console.log(`Kernel ${kernel}`);
        console.log(` `);
        console.log(`Installing...`);
        let authFacetInstallationHash: string | undefined = ((await new Host.Transaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            methodSignature: "function install(address) external returns (bool)",
            methodName: "install",
            methodArgs: [
                authFacet
            ],
            to: kernel,
            confirmations: 1n,
            chainId: 137n,
            value: 0n
        }).receipt()).unwrap())?.hash;
        console.log(`AuthFacet installed ${authFacetInstallationHash}`);
        let facetRouterFacetInstallationHash: string | undefined = ((await new Host.Transaction({
            rpcUrl: rpcUrl,
            privateKey: privateKey.resolve().unwrap(),
            gasPrice: "standard",
            methodSignature: "function install(address) external returns (bool)",
            methodName: "install",
            methodArgs: [
                facetRouterFacet
            ],
            to: kernel,
            confirmations: 1n,
            chainId: 137n,
            value: 0n
        }).receipt()).unwrap())?.hash;
        console.log(`FacetRouterFacet installed ${facetRouterFacetInstallationHash}`);
    }
}

KernelSetUpScript.run();