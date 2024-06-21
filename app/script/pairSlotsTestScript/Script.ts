import type { IEthereumVirtualMachine } from "../../class/ethereumVirtualMachine/IEthereumVirtualMachine.ts";
import { EthereumVirtualMachine } from "../../class/ethereumVirtualMachine/EthereumVirtualMachine.ts";
import { ethers as Ethers } from "ethers";
import { config } from "./Config.ts";
import { secret } from "../../class/host/Secret.ts";
import * as TsResult from "ts-results";

(async function() {
    let url: string = config.testnetNodeUrl;
    let node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(url);
    let signer: Ethers.Wallet = new Ethers.Wallet(config.privateKey, node);
    let machine: IEthereumVirtualMachine = EthereumVirtualMachine(signer);

    enum Side {
        BUY,
        SELL
    }

    enum Option {
        BEST,
        REAL
    }

    (async function() {
        console.log("deploying PairSlots");

        let deployment = await machine.deploy({ bytecode: config.contracts.pairSlots.bytecode });

        if (deployment.err) {
            console.error("unable to deploy PairSlots");
            console.error(deployment.toString());
            return;
        }

        let to = deployment.unwrap()?.contractAddress;

        if (!to) {
            console.error("PairSlots may have been deployed but was unable to return an address");
            return;
        }

        console.log("PairSlots deployed", to);

        let bindSlot = await machine.invoke({
            to,
            methodSignature: "function bindSlot(uint8,address[],uint256) external returns (bool)",
            methodName: "bindSlot",
            methodArgs: [
                0,
                [
                    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", /** WBTC */
                    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", /** WETH */
                    "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"  /** USDC */
                ],
                ether(10) /** 10% */
            ]
        });

        if (bindSlot.err) {
            console.error("failed to bind slot");
            console.error(bindSlot.toString());
            return;
        }
        
        let sellQuote = await machine.query({
            to,
            methodSignature: "function quote(uint8,uint8) external view returns (uint256)",
            methodName: "quote",
            methodArgs: [
                0,
                Side.SELL
            ]
        });

        if (sellQuote.err) {
            console.error("failed to fetch sell quote");
            console.error(sellQuote.toString());
            return;
        }

        console.log(format(sellQuote));

        function ether(value: number) {
            return BigInt(value * (10**18));
        }

        function format(value: TsResult.Result<any, any>) {
            return Number(value.unwrap()) / 10**18;
        }
    })();
})();