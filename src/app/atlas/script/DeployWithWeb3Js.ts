import { type BaseContract } from "ethers";
import { SolFile } from "@atlas/shared/os/SolFile.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Url } from "@atlas/shared/web/Url.ts";
import { Secret } from "@atlas/shared/os/Secret.ts";
import { Result } from "ts-results";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers";
import { Wallet } from "ethers";
import { ethers as Ethers } from "ethers";

class Transaction {
    public constructor(private readonly _state: {
        rpc: {
            url: string;
        };
        contract: {
            address: string;
            method: string;
            args: unknown[];
            file: SolFile;
        };
        privateKey: string;
    }) {}

    public async receipt(): Promise<Ethers.ContractTransactionResponse> {
        return await (new Contract(
            this._state.contract.address,
            this._state.contract.file.abi().unwrap(),
            new Wallet(
                this._state.privateKey,
                new JsonRpcProvider(
                    this._state.rpc.url
                )
            )
        )).getFunction(this._state.contract.method)(...this._state.contract.args);
    }
}

class LowLevelCall {
    public constructor(
        private readonly _state: {
            rpcUrl: string;
            privateKey: string;
            method: {
                signature: string;
                args: unknown[];
            };
            address: string;
            value: number;
        }
    ) {}

    public async receipt(): Promise<Ethers.TransactionReceipt> {
        let node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._state.rpcUrl);
        let wallet: Ethers.Wallet = new Ethers.Wallet(this._state.privateKey, node);
        let i: Ethers.Interface = new Ethers.Interface([`function ${this._state.method.args}`]);
        let data: string = i.encodeFunctionData(this._state.method.signature, this._state.method.args);
        let response: Ethers.TransactionResponse = await wallet.sendTransaction({
            to: this._state.address,
            data: data,
            value: Ethers.parseEther(String(this._state.value))
        });
        return (await response.wait())!;
    }
}

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
        let facetRouterFacet = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/facetRouter/FacetRouterFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap()
            .waitForDeployment();
        console.log("FacetRouterFacet", await facetRouterFacet.getAddress());
        let tokenFacet = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap()
            .waitForDeployment();
        console.log("TokenFacet", await tokenFacet.getAddress());
        let tokenMintFacet = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenMintFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap()
            .waitForDeployment();
        console.log("TokenMintFacet", await tokenMintFacet.getAddress());
        let tokenBurnFacet = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenBurnFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap()
            .waitForDeployment();
        console.log("TokenBurnFacet", await tokenBurnFacet.getAddress());
        let tokenSetterFacet = await (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap()
            .waitForDeployment();
        console.log("TokenSetterFacet", await tokenSetterFacet.getAddress());
        let kernelDiamond = (await (new SolFile(
            new Path(
                "src/app/atlas/sol/solidstate/Diamond.sol"
            )
        ))
            .deploy(rpcUrl, signer))
            .unwrap();
        console.log("KernelDiamond", await kernelDiamond.getAddress());

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "install",
                args: [await authFacet.getAddress()],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/Diamond.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "install",
                args: [await facetRouterFacet.getAddress()],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/Diamond.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "install",
                args: [await tokenFacet.getAddress()],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/Diamond.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "install",
                args: [await tokenBurnFacet.getAddress()],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/Diamond.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "install",
                args: [await tokenMintFacet.getAddress()],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/Diamond.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "install",
                args: [await tokenSetterFacet.getAddress()],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/Diamond.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "claimOwnership",
                args: [],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/kernel/facet/auth/AuthFacet.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
                method: "setTokenSymbol",
                args: ["DREAM"],
                file: new SolFile(
                    new Path(
                        "src/app/atlas/sol/solidstate/kernel/facet/token/TokenSetterFacet.sol"
                    )
                )
            },
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
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
            privateKey: signer.fetch().unwrap()
        }).receipt();

        await new Transaction({
            rpc: {
                url: rpcUrl.toString()
            },
            contract: {
                address: await kernelDiamond.getAddress(),
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
            privateKey: signer.fetch().unwrap()
        }).receipt();
    }
}

App.run();