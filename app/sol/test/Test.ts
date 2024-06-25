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
        let factory = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
        let router = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
        let usdc = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
        let weth = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
        let wbtc = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
        let link = "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39";
        let wmatic = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

        let bytecode = "" as const;
        let abi = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "factory",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "router",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "tokenIn",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "tokenOut",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amountOut",
                        "type": "uint256"
                    }
                ],
                "name": "Swap",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "factory",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "router",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "path",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    }
                ],
                "name": "quote",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "optimal",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "adjusted",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "slippage",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Quote",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "factory",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "router",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "path",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "slippageThreshold",
                        "type": "uint256"
                    }
                ],
                "name": "swap",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
        let adaptor: string = ((await (machine.deploy({
            bytecode, 
            abi,
            args: [
                factory,
                router
            ]
        }))).unwrap())?.contractAddress!;

        async function signerAccount(): Promise<string> {
            return await signer.getAddress();
        }

        async function decimals(erc20: string): Promise<number> {
            return Number((await machine.query({
                to: erc20,
                methodSignature: "function decimals() external view returns (uint8)",
                methodName: "decimals"
            })).unwrap() as bigint);
        }

        async function balance(account: string, erc20: string) {
            return Number((await machine.query({
                to: erc20,
                methodSignature: "function balanceOf(address) external view returns (uint256)",
                methodName: "balanceOf",
                methodArgs: [account]
            })).unwrap() as bigint) / (10**await decimals(erc20));
        }

        async function myBalance(erc20: string): Promise<number> {
            return await balance(await signerAccount(), erc20);
        }

        await (async function() {
            let token0 = tokens.link;
            let token1 = tokens.weth;
            let amount = 1000;
            let slippageThreshold = 5;

            let pair = (await machine.query({
                to: adaptor,
                methodSignature: "function pair(address,address) external view returns (tuple(tuple(bool,string),address,address,address,uint8,uint8,uint112,uint112))",
                methodName: "pair",
                methodArgs: [
                    token0,
                    token1
                ]
            })).unwrap() as any[];

            let quote = (await machine.query({
                to: adaptor,
                methodSignature: `function quote(address[],uint256) external view returns (tuple(tuple(bool,string),tuple(tuple(bool,string),address,address,address,uint8,uint8,uint112,uint112),uint256,uint256,uint256,uint256))`,
                methodName: "quote",
                methodArgs: [
                    [
                        token0,
                        token1
                    ], 
                    BigInt(amount * 10**18)
                ]
            })).unwrap() as any[];

            log("best: ", format(quote[3]));
            log("real: ", format(quote[4]));
            log("slippage: ", format(quote[5]));

            let balanceThen = await myBalance(token0);
            let cashThen = await myBalance(token1);

            (await machine.invoke({
                to: token0,
                methodSignature: "function approve(address,uint256) external view returns (bool)",
                methodName: "approve",
                methodArgs: [
                    adaptor,
                    BigInt(amount * 10**18)
                ]
            })).unwrap();

            (await machine.invoke({
                to: adaptor,
                methodSignature: `function swap(address[],uint256,uint256) external view returns (bool,string)`,
                methodName: "swap",
                methodArgs: [
                    [
                        token0,
                        token1
                    ], 
                    BigInt(amount * 10**18),
                    BigInt(slippageThreshold * 10**18)
                ]
            })).unwrap();

            let balanceNow = await myBalance(token0);
            let cashNow = await myBalance(token1);

            log("link taken from balance", balanceThen - balanceNow);
            log("usdc gained", cashNow - cashThen); 
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