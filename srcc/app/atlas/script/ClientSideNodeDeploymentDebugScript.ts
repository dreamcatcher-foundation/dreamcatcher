import { Host } from "../class/host/Host.ts";
import * as TsResult from "ts-results";
import { EthereumVirtualMachine } from "../class/evm/EthereumVirtualMachine.ts";
import { ethers as Ethers } from "ethers";

/**
 * 
 * > This is an attempt to fix the issue where the Node.sol ERC2535
 *   deployed correctly when done directly through an account but
 *   when deployed from the KernelNode contract which contains all
 *   the initialization logic, it does not work.
 * 
 * > The fault was that once the deployer had transferred ownership
 *   to the KernelNode, the KernelNode did not accept ownership of
 *   the newly created node, therefore causing the revert to occur.
 * 
 */
(async function() {
    console.log("setting up test");

    const url: string = "https://rpc.tenderly.co/fork/223ed3c7-8cef-4b80-bbfc-99ee8a4de882";
    const secret: string | undefined = process?.env?.["polygonPrivateKey"];

    if (!secret) {
        console.error("unable to find polygon private key");
        return;
    }

    const machine: EthereumVirtualMachine = new EthereumVirtualMachine({ signer: new Ethers.Wallet(process?.env?.["polygonPrivateKey"]!, new Ethers.JsonRpcProvider(url)) });
    const kernelNodeAddress: string = "0x4e1e7486b0af43a29598868B7976eD6A45bc40dd";

    /**
     * 
     * > Deploys, commits, and then updates the implementations of the 
     *   NodeDeployer and AdminNodePlugIn on the kernel.
     * 
     */
    const success: boolean = await (async function(): Promise<boolean> {
        
        /**
         * 
         * > Deploys and commits the latest version of NodeDeployer.
         * 
         */
        const nodeDeployerAddress: TsResult.Option<string> = await (async function(): Promise<TsResult.Option<string>> {
            console.log("deploying NodeDeployer.sol");

            const sol: Host.ISolFile = new Host.SolFile(new Host.Path("src/app/atlas/sol/deployer/NodeDeployer.sol"));

            if (!sol.path().exists().unwrapOr(false)) {
                console.error("failed to locate " + sol.path().toString());
                return TsResult.None;
            }

            if (sol.errors().err) {
                console.error("failed to compile errors");
                return TsResult.None;
            }

            if (sol.errors().unwrap().length > 0) {
                console.error("source code errors found");
                sol.errors().unwrap().forEach(error => console.error(error));
                return TsResult.None;
            }

            if (sol.bytecode().err) {
                console.error("failed to compile bytecode");
                return TsResult.None;
            }

            const deployment = await machine.deploy({ bytecode: sol.bytecode().unwrap(), gasPrice: "normal" });

            if (deployment.err) {
                console.error("failed to deploy");
                console.error(deployment.toString());
                return TsResult.None;
            }

            if (!deployment.unwrap()?.status || deployment.unwrap()?.status === 0) {
                console.error("failed to deploy");
                return TsResult.None;
            }

            const address: string | null | undefined = deployment.unwrap()?.contractAddress;

            if (!address) {
                console.error("deployed but address was not returned");
                return TsResult.None;
            }

            console.log("committing");
            
            const commit: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({
                to: kernelNodeAddress,
                methodSignature: "function commit(string memory key, address implementation) external returns (bool)",
                methodName: "commit",
                methodArgs: [
                    "NodeDeployer",
                    address
                ],
                gasPrice: "normal"
            });

            if (commit.err) {
                console.error("failed to commit");
                return TsResult.None;
            }

            if (!commit.unwrap()?.status || commit.unwrap()?.status === 0) {
                console.error("failed to commit");
                return TsResult.None;
            }

            console.log("successful commit");

            console.log("assigning NodeDeployer to KernelNode");

            const assignment = await machine.invoke({
                to: address,
                methodSignature: "function assignToControllerNode(address) external returns (address)",
                methodName: "assignToControllerNode",
                methodArgs: [
                    kernelNodeAddress
                ]
            });

            if (assignment.err) {
                console.error("failed assignment to KernelNode");
                console.error(assignment.toString());
                return TsResult.None;
            }
            
            return new TsResult.Some<string>(address);
        })();

        /**
         * 
         * > Deploys, commits, and updates the kernelNode to the
         *   new AdminNodePlugIn version.
         * 
         */
        const success: boolean = await (async function(): Promise<boolean> {
            if (nodeDeployerAddress.none) {
                console.error("NodeDeployer deployment failed");
                return false;
            }

            console.log("deploying AdminNodePlugIn.sol");

            const sol: Host.ISolFile = new Host.SolFile(new Host.Path("src/app/atlas/sol/class/kernel/adminNode/AdminNodePlugIn.sol"));

            if (!sol.path().exists().unwrapOr(false)) {
                console.error("failed to locate " + sol.path().toString());
                return false;
            }

            if (sol.errors().err) {
                console.error("failed to compile errors");
                return false;
            }

            if (sol.errors().unwrap().length > 0) {
                console.error("source code errors found");
                sol.errors().unwrap().forEach(error => console.error(error));
                return false;
            }

            if (sol.bytecode().err) {
                console.error("failed to compile bytecode");
                return false;
            }

            const deployment = await machine.deploy({ bytecode: sol.bytecode().unwrap(), gasPrice: "normal" });

            if (deployment.err) {
                console.error("failed to deploy");
                console.error(deployment.toString());
                return false;
            }

            if (!deployment.unwrap()?.status || deployment.unwrap()?.status === 0) {
                console.error("failed to deploy");
                return false;
            }

            const address: string | null | undefined = deployment.unwrap()?.contractAddress;

            if (!address) {
                console.error("deployed but address was not returned");
                return false;
            }

            console.log("committing");
            
            const commit: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({
                to: kernelNodeAddress,
                methodSignature: "function commit(string memory key, address implementation) external returns (bool)",
                methodName: "commit",
                methodArgs: [
                    "AdminNodePlugIn",
                    address
                ],
                gasPrice: "normal"
            });

            if (commit.err) {
                console.error("failed to commit");
                return false;
            }

            if (!commit.unwrap()?.status || commit.unwrap()?.status === 0) {
                console.error("failed to commit");
                return false;
            }

            console.log("successful commit");

            const versionsLength: TsResult.Result<unknown, unknown> = await machine.query({ to: kernelNodeAddress, methodSignature: "function versionsLengthOf(string memory key) external view returns (uint256)", methodName: "versionsLengthOf", methodArgs: ["AdminNodePlugIn"] });

            if (versionsLength.err) {
                console.error("failed to query versionsLength");
                return false;
            }

            const versions: string[] = [];

            for (let i = 0; i < (await versionsLength.unwrapOr(0) as number); i++) {
                let version = await machine.query({ to: kernelNodeAddress, methodSignature: "function versionsOf(string memory key, uint256 version) external view returns (address)", methodName: "versionsOf", methodArgs: ["AdminNodePlugIn", i]});
                versions.push((await version.unwrap() as string));
            }

            const facetAddresses: TsResult.Result<unknown, unknown> = await machine.query({ to: kernelNodeAddress, methodSignature: "function facetAddresses() external view returns (address[])", methodName: "facetAddresses" });

            if (facetAddresses.err) {
                console.error("failed to query currently installed plugins");
                return false;
            }

            let oldPlugInAddress: string | undefined = undefined;

            (await facetAddresses.unwrap() as string[]).forEach(facet => {
                versions.forEach(version => {
                    if (facet === version) {
                        oldPlugInAddress = facet;
                    }
                })
            });

            if (!!oldPlugInAddress) {
                console.log("uninstalling old version " + oldPlugInAddress);

                const uninstallation: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({ to: kernelNodeAddress, methodSignature: "function uninstall(address plugIn) external returns (bool)", methodName: "uninstall", methodArgs: [oldPlugInAddress] });

                if (uninstallation.err) {
                    console.error("failed to uinstall old version");
                    return false;
                }

                console.log("installing new version " + address);
                const installation: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({ to: kernelNodeAddress, methodSignature: "function install(address plugIn) external returns (bool)", methodName: "install", methodArgs: [address] });
    
                if (installation.err) {
                    console.error("failed to install new version");
                    return false;
                }

                console.log("successful update to new version");
                return true;
            }

            const reinstallation: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({ to: kernelNodeAddress, methodSignature: "function reinstall(address plugIn) external returns (bool)", methodName: "reinstall", methodArgs: [address]});

            if (reinstallation.err) {
                console.error("failed to install new version");
                return true;
            }

            console.log("successful update to new version");
            return true;
        })();

        return success;
    })();

    if (!success) {
        console.error("set up failed");
        return;
    }

    console.log("deploying my first dao");

    const myFirstDaoDeployment: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({ to: kernelNodeAddress, methodSignature: "function deploy(string) external returns (address)", methodName: "deploy", methodArgs: ["MyFirstDao3"] });
    if (myFirstDaoDeployment.err) {
        console.error("failed to deploy my first dao");
        console.error(myFirstDaoDeployment.toString());
        return;
    }
})();