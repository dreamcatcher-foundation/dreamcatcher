import { EthereumVirtualMachine } from "../class/evm/EthereumVirtualMachine.ts";
import { ethers as Ethers } from "ethers";
import { Host } from "../class/host/Host.ts";

(async function() {
    const path: string = "src/app/atlas/sol/";
    const machine: EthereumVirtualMachine = new EthereumVirtualMachine({ signer: new Ethers.Wallet(process?.env?.["polygonPrivateKey"]!, new Ethers.JsonRpcProvider("https://polygon-rpc.com")) });
    let result = await machine.invoke({
        to: "0x4e1e7486b0af43a29598868B7976eD6A45bc40dd",
        methodSignature: "function commit(string memory key, address implementation) external returns (bool)",
        methodName: "commit",
        methodArgs: [
            "_",
            "0x0000000000000000000000000000000000000000"
        ],
        gasPrice: "normal",
        chainId: 137n,
        confirmations: 1n
    });
    console.log(result.unwrap());
})();