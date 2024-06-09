import { EventBus } from "../src/app/atlas/class/eventBus/EventBus.ts";
import { EthereumVirtualMachine } from "../src/app/atlas/class/evm/EthereumVirtualMachine.ts";
import Readline from "readline";
import * as FileSystem from "fs";
import * as Path from "path";
import * as TsResult from "ts-results";
import { ethers as Ethers } from "ethers";
import { Host } from "../src/app/atlas/class/host/Host.ts";

class State {
    private static _path: string = Path.join(__dirname, "State.json");

    public static set(key: string, value: unknown): TsResult.Result<boolean, unknown> {
        try {
            let content: unknown = FileSystem.existsSync(this._path)
                ? JSON.parse(FileSystem.readFileSync(this._path, "utf8"))
                : {};
            (content as any)[key] = value;
            FileSystem.writeFileSync(this._path, JSON.stringify(content, null, 4), "utf8");
            return new TsResult.Ok<boolean>(true);
        }
        catch (error: unknown) {
            return new TsResult.Err<unknown>(error);
        }
    }

    public static get<Value>(key: string): TsResult.Option<Value> {
        try {
            if (!FileSystem.existsSync(this._path)) {
                return TsResult.None;
            }
            return new TsResult.Some<Value>(JSON.parse(FileSystem.readFileSync(this._path, "utf8"))?.[key]);
        }
        catch (error: unknown) {
            return TsResult.None;
        }
    }
}

class Prompt {
    private _shards: string[] = [];

    public constructor({ content }: { content: string }) {
        this._shards = content.split(" ");
    }

    public shards(): string[] {
        return this._shards;
    }
}

class Console {
    private constructor() {}
    private static _interface = Readline.createInterface({ input: process.stdin, output: process.stdout });

    public static async poll(): Promise<void> {
        this.prompt({ query: "listening ...\n", handler: (content: string) => {
            if (content === "-q" || content === "-quit") {
                this.close();
                console.log("Goodbye.");
            }
            new EventBus.Event({ from: "console", event: "userInput", item: new Prompt({ content: content })});
            this.poll();
            return;
        }});
        return;
    }

    public static async prompt({ query, handler }: { query: string; handler(content: string): void; }): Promise<void> {
        return this._interface.question(query, handler);
    }

    public static async close(): Promise<void> {
        return this._interface.close();
    }
}

interface INetwork {
    name: string;
    url: string;
    secret: string;
    alias: {[value: string]: string};
}

class App {
    public static async run(): Promise<void> {
        new EventBus.EventSubscription({ from: "console", event: "userInput", handler(item): void {
            (async function(): Promise<void> {
                const url: string = "https://rpc.tenderly.co/fork/94851fe6-bae9-4bbf-aafb-427863802e11";
                const prompt: Prompt = item as Prompt;
                const kernel: string = "0x4e1e7486b0af43a29598868B7976eD6A45bc40dd";
                const machine: EthereumVirtualMachine = new EthereumVirtualMachine({ signer: new Ethers.Wallet(process?.env?.["polygonPrivateKey"]!, new Ethers.JsonRpcProvider(url)) });
                await (async function(): Promise<void> {
                    /** -dreamcatcher -commit -update 'repoName' 'solFilePath' */
                    if (prompt.shards()[0] === "-dreamcatcher" && prompt.shards()[1] === "-commit" && prompt.shards()[2] === "-update") {
                        await (async function() {
                            console.log("committing");
                            const repoName: string = prompt.shards()[3];
                            const solFilePath: string = Path.resolve(Path.resolve(__dirname, "../"), prompt.shards()[4]);
                            const sol: Host.ISolFile = new Host.SolFile(new Host.Path(solFilePath));
                            if (!sol.path().exists().unwrapOr(false)) {
                                console.error("unable to continue because source code path does not exist");
                                return;
                            }
                            if (sol.errors().err) {
                                console.error("unable to continue because source code errors are not available");
                                return;
                            }
                            if (sol.errors().unwrap().length > 0) {
                                console.error("unable to continue because source code has errors");
                                sol.errors().unwrap().forEach(error => console.error(error));
                                return;
                            }
                            if (sol.bytecode().err) {
                                console.error("sunable to continue because bytecode is not available");
                                return;
                            }
                            console.log("deploying plugin");
                            const plugInDeployment: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = (await machine.deploy({ bytecode: sol.bytecode().unwrap(), gasPrice: "normal" }));
                            if (plugInDeployment.err) {
                                console.error("unable to continue because the deployment of the plugin failed");
                                console.error(plugInDeployment.toString());
                                return;
                            }
                            if (!plugInDeployment.unwrap()?.status || plugInDeployment.unwrap()?.status === 0) {
                                console.error("unable to continue because the deployment of the plugin failed");
                                return;
                            }
                            const plugInAddress: string | null | undefined = plugInDeployment.unwrap()?.contractAddress;
                            if (!plugInAddress) {
                                console.error("unable to continue because the plugin was deployed but an address was not returned");
                                return;
                            }
                            console.log("plugin deployed to " + plugInAddress);
                            console.log("committing to " + kernel + " as " + repoName);
                            const plugInCommit: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({
                                to: kernel,
                                methodSignature: "function commit(string memory key, address implementation) external returns (bool)",
                                methodName: "commit",
                                methodArgs: [
                                    repoName,
                                    plugInAddress
                                ],
                                gasPrice: "normal"
                            });
                            if (plugInCommit.err) {
                                console.error("unable to continue because commit failed");
                                return;
                            }
                            if (!plugInCommit.unwrap()?.status || plugInCommit.unwrap()?.status === 0) {
                                console.error("unable to continue because commit failed");
                                return;
                            }
                            console.log("commit successful");
                            const versionsLength: TsResult.Result<unknown, unknown> = await machine.query({ to: kernel, methodSignature: "function versionsLengthOf(string memory key) external view returns (uint256)", methodName: "versionsLengthOf", methodArgs: [repoName] });
                            if (versionsLength.err) {
                                console.error("unable to query versionsLength");
                                return;
                            }                            
                            const versions: string[] = [];
                            for (let i = 0; i < (await versionsLength.unwrapOr(0) as number); i++) {
                                let version = await machine.query({ to: kernel, methodSignature: "function versionsOf(string memory key, uint256 version) external view returns (address)", methodName: "versionsOf", methodArgs: [repoName, i]});
                                versions.push((await version.unwrap() as string));
                            }
                            const facetAddresses: TsResult.Result<unknown, unknown> = await machine.query({ to: kernel, methodSignature: "function facetAddresses() external view returns (address[])", methodName: "facetAddresses" });
                            if (facetAddresses.err) {
                                console.error("unable to fetch plugin addresses");
                                return;
                            }
                            let oldPlugInToUninstall: string | undefined = undefined;
                            (await facetAddresses.unwrap() as string[]).forEach(facet => {
                                versions.forEach(version => {
                                    if (facet === version) {
                                        oldPlugInToUninstall = facet;
                                    }
                                });
                            });
                            if (!oldPlugInToUninstall) {
                                console.error("unable to find plugin to replace");
                            }
                            console.log("uninstalling " + oldPlugInToUninstall);
                            const uninstall = await machine.invoke({ to: kernel, methodSignature: "function uninstall(address plugIn) external returns (bool)", methodName: "uninstall", methodArgs: [oldPlugInToUninstall] });
                            if (uninstall.err) {
                                console.error("failed to uninstall old version");
                                return;
                            }
                            console.log("installing " + plugInAddress);
                            const install = await machine.invoke({ to: kernel, methodSignature: "function install(address plugIn) external returns (bool)", methodName: "install", methodArgs: [plugInAddress] });
                            if (install.err) {
                                console.error("failed to install new version");
                                return;
                            }
                            console.log("successfully updated to new version");
                            return;
                        })();
                    }
    
                    /** -dreamcatcher -commit 'repoName' 'solFilePath' */
                    else if (prompt.shards()[0] === "-dreamcatcher" && prompt.shards()[1] === "-commit") {
                        await (async function() {
                            console.log("committing");
                            const repoName: string = prompt.shards()[2];
                            const solFilePath: string = Path.resolve(Path.resolve(__dirname, "../"), prompt.shards()[3]);
                            const sol: Host.ISolFile = new Host.SolFile(new Host.Path(solFilePath));
                            if (!sol.path().exists().unwrapOr(false)) {
                                console.error("unable to continue because source code path does not exist");
                                return;
                            }
                            if (sol.errors().err) {
                                console.error("unable to continue because source code errors are not available");
                                return;
                            }
                            if (sol.errors().unwrap().length > 0) {
                                console.error("unable to continue because source code has errors");
                                sol.errors().unwrap().forEach(error => console.error(error));
                                return;
                            }
                            if (sol.bytecode().err) {
                                console.error("sunable to continue because bytecode is not available");
                                return;
                            }
                            console.log("deploying plugin");
                            const plugInDeployment: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = (await machine.deploy({ bytecode: sol.bytecode().unwrap(), gasPrice: "normal" }));
                            if (plugInDeployment.err) {
                                console.error("unable to continue because the deployment of the plugin failed");
                                console.error(plugInDeployment.toString());
                                return;
                            }
                            if (!plugInDeployment.unwrap()?.status || plugInDeployment.unwrap()?.status === 0) {
                                console.error("unable to continue because the deployment of the plugin failed");
                                return;
                            }
                            const plugInAddress: string | null | undefined = plugInDeployment.unwrap()?.contractAddress;
                            if (!plugInAddress) {
                                console.error("unable to continue because the plugin was deployed but an address was not returned");
                                return;
                            }
                            console.log("plugin deployed to " + plugInAddress);
                            console.log("committing to " + kernel + " as " + repoName);
                            const plugInCommit: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.invoke({
                                to: kernel,
                                methodSignature: "function commit(string memory key, address implementation) external returns (bool)",
                                methodName: "commit",
                                methodArgs: [
                                    repoName,
                                    plugInAddress
                                ],
                                gasPrice: "normal"
                            });
                            if (plugInCommit.err) {
                                console.error("failed to commit");
                                return;
                            }
                            if (!plugInCommit.unwrap()?.status || plugInCommit.unwrap()?.status === 0) {
                                console.error("failed to commit");
                                return;
                            }
                            console.log("commit successful");
                            console.log("plugin deployment cost " + plugInDeployment.unwrap()?.gasUsed ?? "unavailable");
                            console.log("plugin commit cost " + plugInCommit.unwrap()?.gasUsed ?? "unavailable");
                            return;
                        })();
                    }
                })();
                return;
            })();
            return;
        }});
        Console.poll();
        return;
    }
}

App.run();