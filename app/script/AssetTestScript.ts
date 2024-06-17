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
    const deploymentTransaction = await machine.deploy({ bytecode: "6080604052348015600e575f80fd5b50603e80601a5f395ff3fe60806040525f80fdfea2646970667358221220cb5e739dc04953318aaacb0cd93ed0eb726c81ba49fc9e54b4b3ec0cfe3121d764736f6c63430008190033" });
    const assetAddress: string | null | undefined = deploymentTransaction.unwrap()?.contractAddress;
    console.log(assetAddress);
})();