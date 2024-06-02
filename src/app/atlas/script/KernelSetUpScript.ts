import { type BaseContract } from "ethers";
import { SolFile } from "../shared/os/SolFile.ts";
import { ethers as Ethers } from "ethers";
import { Url } from "../shared/web/Url.ts";
import { Secret } from "../shared/os/Secret.ts";
import { Path } from "../shared/os/Path.ts";
import * as Ts from "ts-results";
import * as TsR from "ts-retry";

abstract class iTransactionDisk {
    public abstract rpcUrl: string;
    public abstract contractMethodName: string;
    public abstract contractMethodArgs: unknown[];
    public abstract contractAddress: string;
    public abstract contractSolFile: SolFile;
    public abstract privateKey: string;
}

abstract class iTransaction {
    public abstract receipt(): Promise<Ethers.ContractTransactionResponse>;
}

class Transaction implements iTransaction {
    public constructor(protected _disk: iTransactionDisk) {}

    public async receipt(): Promise<Ethers.ContractTransactionResponse> {
        return await TsR.retryAsync(async () => {
            return await (new Ethers.Contract(
                this._disk.contractAddress,
                this._disk.contractSolFile.abi().unwrap(),
                new Ethers.Wallet(
                    this._disk.privateKey,
                    new Ethers.JsonRpcProvider(
                        this._disk.rpcUrl
                    )
                )
            )).getFunction(this._disk.contractMethodName)(...this._disk.contractMethodArgs);
        }, {
            delay: 60000,
            maxTry: 100,
            onError(error) {
                console.error(error);
            }
        })
    }
}

class KernelSetUpScript {
    private constructor() {}
    public static async run(): Promise<void> {
        const rpc: Url = new Url("https://polygon-rpc.com");
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
        const kernel: BaseContract = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/Diamond.sol"
            )
        ))
            .deploy(rpc, privateKeySecret))
            .unwrap()
            .waitForDeployment();
        console.log("Kernel", await kernel.getAddress());
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "install",
            contractMethodArgs: [
                await authFacet.getAddress()
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/Diamond.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "install",
            contractMethodArgs: [
                await facetRouterFacet.getAddress()
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/Diamond.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "install",
            contractMethodArgs: [
                await tokenFacet.getAddress()
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/Diamond.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "install",
            contractMethodArgs: [
                await tokenMintFacet.getAddress()
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/Diamond.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "install",
            contractMethodArgs: [
                await tokenBurnFacet.getAddress()
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/Diamond.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "install",
            contractMethodArgs: [
                await tokenSetterFacet.getAddress()
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/Diamond.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "claimOwnership",
            contractMethodArgs: [],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "setTokenSymbol",
            contractMethodArgs: [
                "DREAM"
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "commit",
            contractMethodArgs: [
                "auth",
                await authFacet.getAddress()
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/kernel/facet/facetRouter/FacetRouterFacet.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();
        await new Transaction({
            rpcUrl: rpc.toString(),
            contractAddress: await kernel.getAddress(),
            contractMethodName: "mint",
            contractMethodArgs: [
                "0x36C27bDb9Bd78E0d077E63495004919C33B6b717",
                200000000n * (10n ** 18n)
            ],
            contractSolFile: new SolFile(
                new Path(
                    "src/app/atlas/sol/solidstate/kernel/facet/token/TokenMintFacet.sol"
                )
            ),
            privateKey: privateKeySecret.fetch().unwrap()
        }).receipt();   
    }
}

KernelSetUpScript.run();