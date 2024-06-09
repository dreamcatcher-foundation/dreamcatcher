import { Host } from "../class/host/Host.ts";
import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";

(async function(): Promise<void> {
    let nodeUrl: string = "https://rpc.tenderly.co/fork/2f84ec31-e40e-4a96-af57-383a342bf75b";
    let signerKey: TsResult.Option<string> = new Host.Secret("polygonPrivateKey").resolve();
    if (signerKey.none) {
        console.error("unable to complete script because 'polygonPrivateKey' secret is missing");
        return;
    }

    let nodeDeployerAddress: string = await deploy("src/app/atlas/sol/deployer/NodeDeployer.sol");
    let authPlugInAddress: string = await deploy("src/app/atlas/sol/class/misc/auth/AuthPlugIn.sol");
    let routerPlugInAddress: string = await deploy("src/app/atlas/sol/class/kernel/router/RouterPlugIn.sol"); 
    let adminNodePlugInAddress: string = await deploy("src/app/atlas/sol/class/kernel/adminNode/AdminNodePlugIn.sol");
    let kernelNodeAddress: string = await deploy("src/app/atlas/sol/Node.sol");

    await install(kernelNodeAddress, authPlugInAddress);
    await install(kernelNodeAddress, routerPlugInAddress);
    await install(kernelNodeAddress, adminNodePlugInAddress);
    await claimOwnership(kernelNodeAddress);
    await commit(kernelNodeAddress, "NodeDeployer", nodeDeployerAddress);
    await commit(kernelNodeAddress, "AuthPlugIn", authPlugInAddress);
    await commit(kernelNodeAddress, "RouterPlugIn", routerPlugInAddress);
    await deployChild(kernelNodeAddress, "TestDao");
    let nodeAddress: string = await new Host.Query({
        "rpcUrl": nodeUrl,
        "address": kernelNodeAddress,
        "methodSignature": "function daoNode(string) external view returns (address)",
        "methodName": "daoNode",
        "methodArgs": [
            "TestDao"
        ]
    }).response() as string;
    let node: string = await deploy("src/app/atlas/sol/Node.sol");
    await install(node, authPlugInAddress);

    async function deploy(path: string): Promise<string> {
        let solFile: Host.ISolFile = new Host.SolFile(new Host.Path(path));
        if (solFile.errors().unwrap().length != 0) {
            solFile.errors().unwrap().forEach(err => console.error(err));
        }
        return (await new Host.ConstructorTransaction({
            "rpcUrl": nodeUrl,
            "privateKey": signerKey.unwrap(),
            "gasPrice": "fast",
            "bytecode": solFile,
            "confirmations": 1n,
            "chainId": 137n
        }).receipt()!).unwrap()?.contractAddress!;
    }

    async function install(nodeAddress: string, plugInAddress: string): Promise<string> {
        return (await new Host.Transaction({
            "rpcUrl": nodeUrl,
            "privateKey": signerKey.unwrap(),
            "gasPrice": "fast",
            "methodSignature": "function install(address) external returns (bool)",
            "methodName": "install",
            "methodArgs": [plugInAddress],
            "to": nodeAddress
        }).receipt()).unwrap()?.hash!
    }

    async function claimOwnership(nodeAddress: string): Promise<string> {
        return (await new Host.Transaction({
            "rpcUrl": nodeUrl,
            "privateKey": signerKey.unwrap(),
            "gasPrice": "fast",
            "methodSignature": "function claimOwnership() external returns (bool)",
            "methodName": "claimOwnership",
            "to": nodeAddress
        }).receipt()).unwrap()?.hash!
    }

    async function commit(nodeAddress: string, plugInName: string, plugInAddress: string): Promise<string> {
        return (await new Host.Transaction({
            "rpcUrl": nodeUrl,
            "privateKey": signerKey.unwrap(),
            "gasPrice": "fast",
            "methodSignature": "function commit(string,address) external returns (bool)",
            "methodName": "commit",
            "methodArgs": [
                plugInName,
                plugInAddress
            ],
            "to": nodeAddress
        }).receipt()).unwrap()?.hash!;
    }

    async function deployChild(kernelNodeAddress: string, daoName: string): Promise<string> {
        return (await new Host.Transaction({
            "rpcUrl": nodeUrl,
            "privateKey": signerKey.unwrap(),
            "gasPrice": "fast",
            "methodSignature": "function deploy(string) external returns (address)",
            "methodName": "deploy",
            "methodArgs": [daoName],
            "to": kernelNodeAddress
        }).receipt()).unwrap()?.toJSON();
    }
})();