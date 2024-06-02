import { type BaseContract } from "ethers";
import { SolFile } from "@atlas/shared/os/SolFile.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Url } from "@atlas/shared/web/Url.ts";
import { Secret } from "@atlas/shared/os/Secret.ts";
import { Result } from "ts-results";
import { Contract } from "ethers";
import { JsonRpcProvider } from "ethers";
import { Wallet } from "ethers";

import Ethers from "ethers";

class LowLevelCall {
    declare private _rpcUrl: string;
    declare private _privateKey: string;
    declare private _method: {
        signature: string;
        args: unknown[];
    };
    declare private _address: string;
    declare private _value: number;

    public constructor(args: {
        rpcUrl: string;
        privateKey: string;
        method: {
            signature: string;
            args: unknown[];
        };
        address: string;
        value: number;
    }) {
        this._rpcUrl = args.rpcUrl;
        this._privateKey = args.privateKey;
        this._method.signature = args.method.signature;
        this._method.args = args.method.args;
        this._address = args.address;
        this._value = args.value;
    }

    public async receipt(): Promise<Ethers.TransactionReceipt> {
        let node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(this._rpcUrl);
        let wallet: Ethers.Wallet = new Ethers.Wallet(this._privateKey, node);
        let i: Ethers.Interface = new Ethers.Interface([]);
        let data: string = i.encodeFunctionData(this._method.signature, this._method.args);
        let response: Ethers.TransactionResponse = await wallet.sendTransaction({
            to: this._address,
            data: data,
            value: Ethers.parseEther(String(this._value))
        });
        return (await response.wait())!;
    }
}

// test https://rpc.tenderly.co/fork/03e55f5f-556a-4e77-befd-3db0d1761695
// mainnet https://polygon-rpc.com
class App {    
    public static async run() {
        let rpcUrl: Url = new Url("https://rpc.tenderly.co/fork/01647918-a14d-414c-8908-35e8772648ad");
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
        await kernelDiamond.getFunction("install")(await authFacet.getAddress());
        await kernelDiamond.getFunction("install")(await facetRouterFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenBurnFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenMintFacet.getAddress());
        await kernelDiamond.getFunction("install")(await tokenSetterFacet.getAddress());
        
        console.log(await new LowLevelCall({
            rpcUrl: rpcUrl.toString(),
            privateKey: signer.fetch().unwrap(),
            method: {
                signature: "setTokenSymbol(string)",
                args: ["vTEST"]
            },
            address: await kernelDiamond.getAddress(),
            value: 0
        }).receipt());

        /**
        console.log((await (new Contract(
            await kernelDiamond.getAddress(), 
            ["function symbol() external view returns (string memory)"],
            new Wallet(
                signer.fetch().unwrap(),
                new JsonRpcProvider(
                    rpcUrl.toString()
                )
            )
        ))
        .getFunction("symbol")()));
        */
    }
}

App.run();