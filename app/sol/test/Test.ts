import { EthereumVirtualMachine } from "../../class/ethereumVirtualMachine/EthereumVirtualMachine.ts";
import { ethers as Ethers } from "ethers";
import { secret } from "../../class/host/Secret.ts";
import { File } from "../../class/host/file/File.ts";
import { Path } from "../../class/host/Path.ts";
import * as TsResult from "ts-results";

(async function() {
    let mainnetNodeUrl = "https://polygon-rpc.com";
    let testnetNodeUrl =  "https://rpc.tenderly.co/fork/ca9185f3-d050-4189-90b5-53d35e920601";
    let nodeUrl = testnetNodeUrl;
    let key = secret("polygonPrivateKey");
    if (key.none) {
        err("MISSING_PRIVATE_KEY");
        return;
    }
    let node = new Ethers.JsonRpcProvider(nodeUrl);
    let signer = new Ethers.Wallet(key.unwrap(), node);
    let machine = EthereumVirtualMachine(signer);

    await (async function() {
        let tokens = {
            usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
            weth: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            wbtc: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            link: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
            wmatic: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
        };
        let factory = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
        let router = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
        let bytecode = "";
        let abi = [];
        let adaptor = ((await (machine.deploy({ bytecode, abi }))).unwrap())?.contractAddress!;
        
        await (async function() {


        })();

    })();
})();

function log(...any: any[]) {
    return console.log(...any);
}

function err(...any: any[]) {
    return console.error(...any);
}

function format(any: any) {
    return Number(any) / 10**18
}