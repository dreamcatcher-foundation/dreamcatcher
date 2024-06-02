import { JsonRpcProvider, type BaseContract } from "ethers";
import { SolFile } from "../shared/os/SolFile.ts";
import { ethers as Ethers } from "ethers";
import { Url } from "../shared/web/Url.ts";
import { Secret } from "../shared/os/Secret.ts";
import { Path } from "../shared/os/Path.ts";
import * as Ts from "ts-results";

abstract class iConstructorTransactionDisk {
    public abstract rpcUrl: string;
    public abstract signature: string;
    public abstract gasPrice?: 
        | bigint
        | "veryLow"
        | "low"
        | "standard"
        | "fast";
    public abstract gasLimit?: bigint;
    public abstract bytecode: string | SolFile;
    public abstract chainId?: bigint;
    public abstract confirmations?: bigint;
}

class ConstructorTransaction {
    public constructor(protected _disk: iConstructorTransactionDisk) {}

    public async receipt(): Promise<Ethers.TransactionReceipt | null> {
        const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._disk.rpcUrl);
        const wallet: Ethers.Wallet = new Ethers.Wallet(this._disk.signature, node);
        return await (await wallet.sendTransaction({
            from: await wallet.getAddress(),
            to: null,
            nonce: await wallet.getNonce(),
            gasPrice: 
                this._disk.gasPrice === "veryLow"
                    ? 20000000000n : 
                this._disk.gasPrice === "low"
                    ? 30000000000n : 
                this._disk.gasPrice === "standard"
                    ? 50000000000n : 
                this._disk.gasPrice === "fast"
                    ? 70000000000n : 
                this._disk.gasPrice === undefined
                    ? 20000000000n : 
                this._disk.gasPrice,
            gasLimit: this._disk.gasLimit ?? 10000000n,
            value: 0n,
            data: 
                this._disk.bytecode instanceof SolFile 
                    ? `0x${this._disk.bytecode.bytecode().unwrap()}` : 
                this._disk.bytecode,
            chainId: this._disk.chainId ?? (await node.getNetwork()).chainId
        })).wait(Number(this._disk.confirmations));
    }
}

abstract class iQueryArgs {
    public abstract rpcUrl: string;
    public abstract address: string;
    public abstract methodSignature: string;
    public abstract methodName: string;
    public abstract methodArgs: unknown[];
}

class Query {
    public constructor(protected _state: iQueryArgs) {}

    public async response(): Promise<unknown> {
        const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._state.rpcUrl);
        return await (new Ethers.Contract(
            this._state.address, [
                this._state.methodSignature
            ],
            node
        )).getFunction(this._state.methodName)(...this._state.methodArgs);
    }
}

class Transaction {
    public async receipt() {
        const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._disk.rpcUrl);
        const wallet: Ethers.Wallet = new Ethers.Wallet(this._disk.signature, node);
        console.log(await (await wallet.sendTransaction({
            from: await wallet.getAddress(),
            to: "0x9b0561109B5a9c0eB437D708477b1b5c14a67CA8",
            nonce: await wallet.getNonce(),
            gasPrice: 40000000000n,
            gasLimit: 10000000n,
            value: 0,
            data: (new Ethers.Interface([
                "function selectors()"
            ])).encodeFunctionData("selectors"),
            chainId: 137n
        })).wait(1));
    }
}

class KernelSetUpScript {
    private constructor() {}
    public static async run(): Promise<void> {
        /**
        console.log(await new ConstructorTransaction({
            rpcUrl: "https://polygon-rpc.com",
            signature: process?.env?.["polygonPrivateKey"]!,
            gasPrice: "standard",
            bytecode: new SolFile(new Path("src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol")),
            chainId: 137n,
            confirmations: 1n
        }).receipt());
        */
        
        console.log(await new Query({
            address: "0x9b0561109B5a9c0eB437D708477b1b5c14a67CA8",
            methodSignature: "function hasRole(address,string) external view returns (bool)",
            methodName: "hasRole",
            methodArgs: [
                "0x36C27bDb9Bd78E0d077E63495004919C33B6b717",
                "owner"
            ],
            rpcUrl: "https://polygon-rpc.com"
        }).response());

        /**
        const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider("https://polygon-rpc.com");
        const wallet: Ethers.Wallet = new Ethers.Wallet(process?.env?.["polygonPrivateKey"]!, node);
        console.log(await (await wallet.sendTransaction({
            from: await wallet.getAddress(),
            to: "0x9b0561109B5a9c0eB437D708477b1b5c14a67CA8",
            nonce: await wallet.getNonce(),
            gasPrice: 40000000000n,
            gasLimit: 10000000n,
            value: 0,
            data: (new Ethers.Interface([
                "function selectors()"
            ])).encodeFunctionData("selectors"),
            chainId: 137n
        })).wait(1));
        
        /**
        const rpc: Url = new Url();
        const privateKeySecret: Secret = new Secret("polygonPrivateKey");
        const privateKey: Ts.Option<string> = privateKeySecret.fetch();
        if (privateKey.none) {
            console.error("KernelSetUpScript::MissingPrivateKey");
            return;
        }
        const authFacet: BaseContract = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol"
            )
        ))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment();
        console.log("AuthFacet", await authFacet.getAddress());
        const facetRouterFacet: BaseContract = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/facetRouter/FacetRouterFacet.sol"
            )
        ))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment();
        console.log("FacetRouterFacet", await facetRouterFacet.getAddress());
        const tokenFacet: BaseContract = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenFacet.sol"
            )
        ))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment();
        console.log("TokenFacet", await tokenFacet.getAddress());
        const tokenMintFacet: BaseContract = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenMintFacet.sol"
            )
        ))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment();
        console.log("TokenMintFacet", await tokenMintFacet.getAddress());
        const tokenBurnFacet: BaseContract = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenBurnFacet.sol"
            )
        ))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment();
        console.log("TokenBurnFacet", await tokenBurnFacet.getAddress());
        const tokenSetterFacet: BaseContract = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol"
            )
        ))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment();
        console.log("TokenSetterFacet", await tokenSetterFacet.getAddress());
        const kernel: BaseContract = (await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/Diamond.sol")))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment());
        console.log("Kernel", await kernel.getAddress());
        await kernel.getFunction("install")(await authFacet.getAddress());
        await kernel.getFunction("install")(await facetRouterFacet.getAddress());
        await kernel.getFunction("install")(await tokenFacet.getAddress());
        await kernel.getFunction("install")(await tokenBurnFacet.getAddress());
        await kernel.getFunction("install")(await tokenMintFacet.getAddress());
        await kernel.getFunction("install")(await tokenSetterFacet.getAddress());


        const transaction: Ethers.Transaction;

        kernel.fallback!({
            data: authFacet.interface.encodeFunctionData("claimOwnership"),
            
        })
    

        /**


        await new Transaction({
            rpc: {
                url: rpc.toString()
            },
            contract: {
                address: await kernel.getAddress(),
                method: "claimOwnership",
                args: [],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol"
                    )
                )
            },
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpc: {
                url: rpc.toString()
            },
            contract: {
                address: await kernel.getAddress(),
                method: "setTokenSymbol",
                args: ["DREAM"],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol"
                    )
                )
            },
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpc: {
                url: rpc.toString()
            },
            contract: {
                address: await kernel.getAddress(),
                method: "commit",
                args: [
                    "auth", 
                    await authFacet.getAddress()
                ],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/kernel/facet/facetRouter/FacetRouterFacet.sol"
                    )
                )
            },
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpc: {
                url: rpc.toString()
            },
            contract: {
                address: await kernel.getAddress(),
                method: "mint",
                args: [
                    "0x36C27bDb9Bd78E0d077E63495004919C33B6b717",
                    200000000n * (10n ** 18n)
                ],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/kernel/facet/token/TokenMintFacet.sol"
                    )
                )
            },
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();

        */
    }
}

KernelSetUpScript.run();