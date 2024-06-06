import { Host } from "@atlas/class/host/Host.ts";
import { ethers as Ethers } from "ethers";

class KernelSetUpScript {
    private constructor() {}
    protected static _rpcUrl: string = "https://polygon-rpc.com";
    protected static _privateKey: Host.ISecret = new Host.Secret("polygonPrivateKey");

    public static async run(): Promise<void> {
        if (this._privateKey.resolve().none) {
            console.log("KernelSetUpScript::MissingPrivateKey");
            return;
        }
        const nodeDeployerAddress: string = await this._deploy("src/app/atlas/sol/deployer/NodeDeployer.sol");
        const authPlugInAddress: string = await this._deploy("src/app/atlas/sol/class/misc/auth/AuthPlugIn.sol");
        const tokenPlugInAddress: string = await this._deploy("src/app/atlas/sol/class/misc/token/TokenPlugIn.sol");
        const tokenSetterPlugInAddress: string = await this._deploy("src/app/atlas/sol/class/misc/token/TokenSetterPlugIn.sol");
        const tokenMintPlugInAddress: string = await this._deploy("src/app/atlas/sol/class/misc/token/TokenMintPlugIn.sol");
        const tokenBurnPlugInAddress: string = await this._deploy("src/app/atlas/sol/class/misc/token/TokenBurnPlugIn.sol");
        const routerPlugInAddress: string = await this._deploy("src/app/atlas/sol/class/kernel/router/RouterPlugIn.sol");
        const adminNodePlugInAddress: string = await this._deploy("src/app/atlas/sol/class/kernel/adminNode/AdminNodePlugIn.sol");
        const kernelNodeAddress: string = await this._deploy("src/app/atlas/sol/Node.sol");
        await this._install(kernelNodeAddress, authPlugInAddress);
        await this._install(kernelNodeAddress, tokenPlugInAddress);
        await this._install(kernelNodeAddress, tokenSetterPlugInAddress);
        await this._install(kernelNodeAddress, tokenMintPlugInAddress);
        await this._install(kernelNodeAddress, tokenBurnPlugInAddress);
        await this._install(kernelNodeAddress, routerPlugInAddress);
        await this._install(kernelNodeAddress, adminNodePlugInAddress);
        await this._claimOwnership(kernelNodeAddress);
        await this._commit(kernelNodeAddress, "NodeDeployer", nodeDeployerAddress);
        await this._commit(kernelNodeAddress, "AuthPlugIn", authPlugInAddress);
        await this._commit(kernelNodeAddress, "TokenPlugIn", tokenPlugInAddress);
        await this._commit(kernelNodeAddress, "TokenSetterPlugIn", tokenSetterPlugInAddress);
        await this._commit(kernelNodeAddress, "TokenMintPlugIn", tokenMintPlugInAddress);
        await this._commit(kernelNodeAddress, "TokenBurnPlugIn", tokenBurnPlugInAddress);
        await this._commit(kernelNodeAddress, "RouterPlugIn", routerPlugInAddress);
        await this._commit(kernelNodeAddress, "AdminNodePlugIn", adminNodePlugInAddress);
        console.log("NodeDeployer", nodeDeployerAddress);
        console.log("AuthPlugIn", authPlugInAddress);
        console.log("TokenPlugIn", tokenPlugInAddress);
        console.log("TokenSetterPlugIn", tokenSetterPlugInAddress);
        console.log("TokenMintPlugIn", tokenMintPlugInAddress);
        console.log("TokenBurnPlugIn", tokenBurnPlugInAddress);
        console.log("RouterPlugIn", routerPlugInAddress);
        console.log("AdminNodePlugIn", adminNodePlugInAddress);
        console.log("KernelNode", kernelNodeAddress);
    }

    protected static async _deploy(solFilePath: string): Promise<string> {
        return ((await new Host.ConstructorTransaction({
            rpcUrl: this._rpcUrl,
            privateKey: this._privateKey.resolve().unwrap(),
            gasPrice: "standard",
            bytecode: new Host.SolFile(new Host.Path(solFilePath)),
            confirmations: 1n,
            chainId: 137n
        }).receipt()).unwrap()!).contractAddress!;
    }

    protected static async _install(kernelNodeAddress: string, plugInAddress: string): Promise<string | undefined> {
        return ((await new Host.Transaction({
            rpcUrl: this._rpcUrl,
            privateKey: this._privateKey.resolve().unwrap(),
            gasPrice: "standard",
            methodSignature: "function install(address) external returns (bool)",
            methodName: "install",
            methodArgs: [
                plugInAddress
            ],
            to: kernelNodeAddress,
            confirmations: 1n,
            chainId: 137n,
            value: 0n
        }).receipt()).unwrap())?.hash;
    }

    protected static async _commit(kernelNodeAddress: string, repoName: string, implementationAddress: string) {
        return ((await new Host.Transaction({
            rpcUrl: this._rpcUrl,
            privateKey: this._privateKey.resolve().unwrap(),
            gasPrice: "standard",
            methodSignature: "function commit(string,address) external returns (bool)",
            methodName: "commit",
            methodArgs: [
                repoName,
                implementationAddress
            ],
            to: kernelNodeAddress,
            confirmations: 1n,
            chainId: 137n,
            value: 0n
        }).receipt()).unwrap())?.hash;
    }

    protected static async _claimOwnership(kernelNodeAddress: string) {
        return ((await new Host.Transaction({
            rpcUrl: this._rpcUrl,
            privateKey: this._privateKey.resolve().unwrap(),
            gasPrice: "standard",
            methodSignature: "function claimOwnership() external returns (bool)",
            methodName: "claimOwnership",
            to: kernelNodeAddress,
            confirmations: 1n,
            chainId: 137n,
            value: 0n
        }).receipt()).unwrap())?.hash;
    }
}

KernelSetUpScript.run();