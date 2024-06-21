import type { IEthereumVirtualMachine } from "../../class/ethereumVirtualMachine/IEthereumVirtualMachine.ts";
import { EthereumVirtualMachine } from "../../class/ethereumVirtualMachine/EthereumVirtualMachine.ts";
import { ethers as Ethers } from "ethers";
import { SolFile } from "../../class/host/file/SolFile.ts";
import { ownableTokenBytecode } from "./data.ts";
import { ownableTokenAbi } from "./data.ts";
import { vaultBytecode } from "./data.ts";
import { vaultAbi } from "./data.ts";
import { secret } from "../../class/host/Secret.ts";
import * as TsResult from "ts-results";

(async function() {
    let mainnetNodeUrl = "https://polygon-rpc.com";
    let testnetNodeUrl =  "https://rpc.tenderly.co/fork/32d6d64e-587c-47bf-9b50-98d37af5c16d";
    let nodeUrl = testnetNodeUrl;
    let key = secret("polygonPrivateKey");
    if (key.none) {
        console.error("missing key");
        return;
    }
    let node = new Ethers.JsonRpcProvider(nodeUrl);
    let signer = new Ethers.Wallet(key.unwrap(), node);
    let machine = EthereumVirtualMachine(signer);

    (async function() {
        const CURRENCY = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
        console.log("starting testing session");
        console.log("deploying ownable token");
        let ownableTokenDeployment = await machine.deploy({ 
            bytecode: ownableTokenBytecode, 
            abi: ownableTokenAbi as any, 
            args: [
                "TestToken",
                "vTT",
                await signer.getAddress()
            ]
        });
        if (ownableTokenDeployment.err) {
            console.error("unable to deploy ownable token");
            console.error(ownableTokenDeployment.toString());
            return;
        }
        let ownableTokenAddress = ownableTokenDeployment.unwrap()?.contractAddress;
        if (!ownableTokenAddress) {
            console.error("ownable token may have been deployed but was unable to return an address");
            return;
        }
        console.log("deployed ownable token", ownableTokenAddress);
        console.log("deploying vault");
        let pairs = [{
            /** WMATIC > WETH > USDC */
            path: [
                "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
            ],
            targetAllocation: 100n * 10n**18n
        }];
        let vaultDeployment = await machine.deploy({
            bytecode: vaultBytecode,
            abi: vaultAbi as any,
            args: [
                ownableTokenAddress,
                pairs
            ]
        });
        if (vaultDeployment.err) {
            console.error("unable to deploy vault");
            console.error(vaultDeployment.toString());
            return;
        }
        let vaultAddress = vaultDeployment.unwrap()?.contractAddress;
        if (!vaultAddress) {
            console.error("vault may have been deployed but was unable to return an address");
            return;
        }
        console.log("deployed vault", vaultAddress);

        /** TRANFER TOKEN OWNERSHIP */
        console.log("transfering ownable token ownership to vault");
        let ownableTokenOwnershipTransfer = await machine.invoke({
            to: ownableTokenAddress,
            methodSignature: "function transferOwnership(address)",
            methodName: "transferOwnership",
            methodArgs: [
                vaultAddress
            ]
        });
        if (ownableTokenOwnershipTransfer.err) {
            console.error("failed to transfer ownership to vault");
            console.error(ownableTokenOwnershipTransfer.toString());
            return;
        }
        console.log("ownable token ownership transferred");

        await _mint(100);
        await _rebalance();

        async function _rebalance() {
            console.log("slippage", uint(await machine.query({
                to: vaultAddress!,
                methodSignature: "function slippage(uint8,uint256,uint8) external view returns (uint256)",
                methodName: "slippage",
                methodArgs: [
                    0,
                    BigInt(1 * 10**18),
                    0
                ]
            })));

            console.log("rebalancing");
            let rebalance = await machine.invoke({
                to: vaultAddress!,
                methodSignature: "function rebalance() external",
                methodName: "rebalance"
            });
            if (rebalance.err) {
                console.error("failed to rebalance");
                console.error(rebalance.toString());
                return;
            }
            console.log("successful rebalance");
            console.log("verifying rebalance");
            for (let i = 0; i < pairs.length; i += 1) {
                let pair = pairs[i];
                let asset = pair.path[0];
                let balance = await machine.query({
                    to: asset,
                    methodSignature: "function balanceOf(address) external view returns (uint256)",
                    methodName: "balanceOf",
                    methodArgs: [
                        vaultAddress!
                    ]
                });
                console.log("new balance", asset, uint(balance) + " tokens");
            }
        }

        async function _mint(currencyIn: number) {
            console.log("minting");
            let amountIn = BigInt(currencyIn * 10**18);
            let approval = await machine.invoke({
                to: CURRENCY,
                methodSignature: "function approve(address,uint256)",
                methodName: "approve",
                methodArgs: [
                    vaultAddress,
                    amountIn
                ]
            });
            if (approval.err) {
                console.error("failed to approve currency transfer");
                console.error(approval.toString());
                return;
            }
            console.log("successful transfer approval");
            let mint = await machine.invoke({
                to: vaultAddress!,
                methodSignature: "function mint(uint256)",
                methodName: "mint",
                methodArgs: [
                    amountIn
                ]
            });
            if (mint.err) {
                console.error("failed to mint");
                console.error(mint.toString());
                return;
            }
            console.log("successful mint");
            console.log("verifying tokens minted");
            let totalSupply = await machine.query({
                to: ownableTokenAddress!,
                methodSignature: "function totalSupply() external view returns (uint256)",
                methodName: "totalSupply"
            });
            console.log("new total supply is", uint(totalSupply) + " tokens");
            let totalBestAssets = await machine.query({
                to: vaultAddress!,
                methodSignature: "function totalBestAssets() external view returns (uint256)",
                methodName: "totalBestAssets"
            });
            console.log("new total best assets", "$" + uint(totalBestAssets));
            let totalRealAssets = await machine.query({
                to: vaultAddress!,
                methodSignature: "function totalRealAssets() external view returns (uint256)",
                methodName: "totalRealAssets"
            });
            console.log("new total real assets", "$" + uint(totalRealAssets));
        }

        function uint(value: TsResult.Result<unknown, unknown>) {
            if (value.err) {
                return "failed to fetch value " + value.toString();
            }
            return Number(value.unwrap()) / 10**18;
        }
    })();
})();