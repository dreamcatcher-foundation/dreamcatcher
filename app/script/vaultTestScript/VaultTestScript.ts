import type { IEthereumVirtualMachine } from "../../class/ethereumVirtualMachine/IEthereumVirtualMachine.ts";
import { EthereumVirtualMachine } from "../../class/ethereumVirtualMachine/EthereumVirtualMachine.ts";
import { ethers as Ethers } from "ethers";
import { config } from "./Config.ts";
import { secret } from "../../class/host/Secret.ts";
import * as TsResult from "ts-results";

(async function() {
    const mainnetNodeUrl: string = "https://polygon-rpc.com";
    const testnetNodeUrl: string =  "https://rpc.tenderly.co/fork/32d6d64e-587c-47bf-9b50-98d37af5c16d";
    const url: string = testnetNodeUrl;
    const key: TsResult.Option<string> = secret("polygonPrivateKey");
    if (key.none) {
        console.error("missing key");
        return;
    }
    const node: Ethers.JsonRpcProvider = new Ethers.JsonRpcProvider(url);
    const signer: Ethers.Wallet = new Ethers.Wallet(key.unwrap(), node);
    const machine: IEthereumVirtualMachine = EthereumVirtualMachine(signer);

    (async function() {
        console.log("deploying token factory");
        const tokenFactoryDeployment: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.deploy({ bytecode: config.tokenFactory.bytecode });
        if (tokenFactoryDeployment.err) {
            console.error("unable to deploy token factory");
            console.error(tokenFactoryDeployment.toString());
            return;
        }
        const tokenFactoryAddress: string | null | undefined = tokenFactoryDeployment.unwrap()?.contractAddress;
        if (!tokenFactoryAddress) {
            console.error("token factory may have been deployed but was unable to return an address");
            return;
        }
        console.log("deploying pair factory");
        const pairFactoryDeployment: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.deploy({ bytecode: config.pairFactory.bytecode });
        if (pairFactoryDeployment.err) {
            console.error("unable to deploy pair factory.");
            console.error(pairFactoryDeployment.toString());
            return;
        }
        const pairFactoryAddress: string | null | undefined = pairFactoryDeployment.unwrap()?.contractAddress;
        if (!pairFactoryAddress) {
            console.error("pair factory may have been deployed but was unable to return an address");
            return;
        }
        const vaultCurrency: string = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; /** USDC */
        const vaultTokenName: string = "TestVault";
        const vaultTokenSymbol: string = "vTEST";
        const vaultPairs: Array<{ path: string[]; targetAllocation: bigint }> = [{
            path: [
                "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", /** WBTC */
                "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                vaultCurrency
            ],
            targetAllocation: BigInt(50 * (10**18)) /** 50% */
        }, {
            path: [
                "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", /** WETH */
                vaultCurrency
            ],
            targetAllocation: BigInt(50 * (10**18)) /** 50% */
        }];
        console.log("deploying vault");
        const vaultDeployment: TsResult.Result<Ethers.TransactionReceipt | null, unknown> = await machine.deploy({
            bytecode: config.vault.bytecode,
            abi: config.vault.abi as unknown as string[] | object[],
            args: [
                tokenFactoryAddress,
                pairFactoryAddress,
                vaultTokenName,
                vaultTokenSymbol,
                vaultPairs
            ]
        });
        if (vaultDeployment.err) {
            console.error("unable to deploy vault.");
            console.error(vaultDeployment.toString());
            return;
        }
        const vaultAddress: string | null | undefined = vaultDeployment.unwrap()?.contractAddress;
        if (!vaultAddress) {
            console.error("vault may have been deployed but was unable to return an address");
            return;
        }
        console.log(vaultAddress);

        /** Mint */
        await (async function() {
            await approve(100000000000000);
            await mint(1.00);
            console.log(await currencyAt(vaultAddress));

            async function approve(amount: number) {
                const result = await machine.invoke({
                    to: vaultCurrency,
                    methodSignature: "function approve(address,uint256) external",
                    methodName: "approve",
                    methodArgs: [
                        vaultAddress,
                        toEther(amount) /** Wrong but should be high enough */
                    ]
                });
                if (result.err) {
                    console.error(result.toString());
                    return false;
                }
                return true
            }

            async function mint(amount: number) {
                const mint = await machine.invoke({
                    to: vaultAddress!,
                    methodSignature: "function mint(uint256) external returns (uint256)",
                    methodName: "mint",
                    methodArgs: [
                        toEther(amount)
                    ]
                });
                if (mint.err) {
                    console.error("failed to mint");
                    console.error(mint.toString());
                    return;
                }
                console.log("successful mint");
            }
        })();

        const totalBestAssets = await machine.query({
            to: vaultAddress,
            methodSignature: "function totalBestAssets() external view returns (uint256)",
            methodName: "totalBestAssets"
        });
        if (totalBestAssets.err) {
            console.error("unable to retrieve total best assets");
            console.error(totalBestAssets.toString());
            return;
        }
        console.log("total best assets " + "$" + Number(totalBestAssets.unwrap()) / 10**18);
        const totalRealAssets = await machine.query({
            to: vaultAddress,
            methodSignature: "function totalRealAssets() external view returns (uint256)",
            methodName: "totalRealAssets"
        });
        if (totalRealAssets.err) {
            console.error("unable to retrieve total real assets");
            console.error(totalRealAssets.toString());
            return;
        }
        console.log("total real assets " + "$" + Number(totalRealAssets.unwrap()) / 10**18);
        const rebalance = await machine.invoke({
            to: vaultAddress,
            methodSignature: "function rebalance() external returns (bool)",
            methodName: "rebalance"
        });
        if (rebalance.err) {
            console.error("unable to rebalance vault");
            console.error(rebalance.toString());
            return;
        }

        await (async function() {
            const amountIn: bigint = BigInt(1000000 * (10**18));
            const burn = await machine.invoke({
                to: vaultAddress,
                methodSignature: "function burn(uint256) external returns (uint256)",
                methodName: "burn",
                methodArgs: [
                    amountIn
                ]
            });
            if (burn.err) {
                console.error("failed to burn");
                console.error(burn.toString());
                return;
            }
            console.log("successful burn");
        })();

        async function currencyAt(address: string) {
            const result = await machine.query({
                to: vaultCurrency,
                methodSignature: "function balanceOf(address) external view returns (uint256)",
                methodName: "balanceOf",
                methodArgs: [
                    address
                ]
            });
            if (result.err) {
                console.error(result.toString());
                return;
            }
            return "$" + (Number(result.unwrap()) / 10**18).toFixed(20);
        }

        function toEther(value: number) {
            return BigInt(value * (10**18));
        }
    })();
})();