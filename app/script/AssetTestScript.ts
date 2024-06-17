import type { IEthereumVirtualMachine } from "../class/ethereumVirtualMachine/IEthereumVirtualMachine.ts";
import type { ISolFile } from "../class/host/file/ISolFile.ts";
import { EthereumVirtualMachine } from "../class/ethereumVirtualMachine/EthereumVirtualMachine.ts";
import { ethers as Ethers } from "ethers";
import { SolFile } from "../class/host/file/SolFile.ts";
import { Path } from "../class/host/Path.ts";
import { secret } from "../class/host/Secret.ts";
import * as TsResult from "ts-results";

(async function() {
    const url: string = "https://rpc.tenderly.co/fork/223ed3c7-8cef-4b80-bbfc-99ee8a4de882";
    const key: TsResult.Option<string> = secret("polygonPrivateKey");
    const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(url);
    const signer: Ethers.Wallet = new Ethers.Wallet(key.unwrap(), node);
    const machine: IEthereumVirtualMachine = EthereumVirtualMachine(signer);
    const sol: TsResult.Result<ISolFile, unknown> = SolFile(Path("app/sol/Asset.sol"));
    console.log(sol.unwrap().bytecode());
    const bytecode = sol.unwrap().bytecode().unwrap();
    const deploymentTransaction = await machine.deploy({ bytecode });
    const assetAddress: string | null | undefined = deploymentTransaction.unwrap()?.contractAddress;
    console.log(assetAddress);
})();