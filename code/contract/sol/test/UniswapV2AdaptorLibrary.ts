// SPDX-License-Identifier: UNLICENSED
import {type IConfig, type IEngine, Engine} from "./ScarletEngine/ScarletEngine.ts";

const config: IConfig = {
    contracts: [{
        name: "TestableUniswapV2AdaptorLibrary",
        path: "code/contract/sol/native/utils/adaptor/TestableUniswapV2AdaptorLibrary.sol"
    }],
    fSrcDir: "code/contract/sol/dist",
    networks: [{
        name: "polygonTenderlyFork",
        rpcUrl: process.env.polygonTenderlyForkRpcUrl!,
        privateKey: process.env.polygonPrivateKey!
    }]
}

const engine: IEngine = new Engine(config);

async function main() {
    const networkId = "polygonTenderlyFork";
    const contractName = "TestableUniswapV2AdaptorLibrary";
    const contract: any = await engine.deployContract(networkId, contractName);
    const polygonFactory = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
    const polygonRouter = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
    const WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
    const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
    const QUICK = "0xB5C064F955D8e7F38fE0460C556a72987494eE17";
    const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
    const WBTC = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
    const A51 = "0xe9E7c09e82328c3107d367f6c617cF9977e63ED0";
    const AAVE = "0xD6DF932A45C0f255f85145f286eA0b292B21C90B";
    const ABOND = "0xe6828D65bf5023AE1851D90D8783Cc821ba7eeE1";
    const ALI = "0xbFc70507384047Aa74c29Cdc8c5Cb88D0f7213AC";
    const priceWBTCUSDT = await contract.price(WBTC, USDT, polygonFactory, polygonRouter);
    const priceWETHUSDT = await contract.price(WETH, USDT, polygonFactory, polygonRouter);
    const amountOutWBTCUSDT = await contract.amountOut([WBTC, USDT], polygonFactory, polygonRouter, 1n * (10n ** 18n));
    const amountOutWETHUSDT = await contract.amountOut([WETH, USDT], polygonFactory, polygonRouter, 1n * (10n ** 18n));
    const yieldWBTCUSDT = await contract.yield([WBTC, USDT], polygonFactory, polygonRouter, 1n * (10n ** 18n));
    const yieldWETHUSDT = await contract.yield([WETH, USDT], polygonFactory, polygonRouter, 1n * (10n ** 18n));
    console.log({
        priceWBTCUSDT: (Number(priceWBTCUSDT) / (10 ** 18)),
        priceWETHUSDT: (Number(priceWETHUSDT) / (10 ** 18)),
        amountOutWBTCUSDT: (Number(amountOutWBTCUSDT) / (10 ** 18)),
        amountOutWETHUSDT: (Number(amountOutWETHUSDT) / (10 ** 18)),
        yieldWBTCUSDT: yieldWBTCUSDT,
        yieldWETHUSDT: yieldWETHUSDT // should not be returning zero.
    });
}

main();