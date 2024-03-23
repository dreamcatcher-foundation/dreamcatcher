// SPDX-License-Identifier: UNLICENSED
import {type IConfig, type IEngine, Engine} from "./ScarletEngine/ScarletEngine.ts";

const config: IConfig = {
    contracts: [{
        name: "UniswapV2Adaptor",
        path: "code/contract/sol/native/utils/adaptor/UniswapV2Adaptor.sol"
    }, {
        name: "FixedPointMath",
        path: "code/contract/sol/native/utils/math/FixedPointMath.sol"
    }, {
        name: "ShareMath",
        path: "code/contract/sol/native/utils/math/ShareMath.sol"
    }, {
        name: "IERC20",
        path: "code/contract/sol/non-native/openzeppelin/token/ERC20/IERC20.sol"
    }],
    fSrcDir: "code/contract/sol/dist",
    networks: [{
        name: "polygonTestnet",
        rpcUrl: process.env.polygonTestnetRpcUrl!,
        privateKey: process.env.polygonTestnetPrivateKey!
    }]
}

const engine: IEngine = new Engine(config);

async function main() {
    let networkId: string = "polygonTestnet";
    let fixedPointMathBlueprint: string = "FixedPointMath";
    let uniswapV2AdaptorBlueprint: string = "UniswapV2Adaptor";
    let ierc20: string  = "IERC20";
    let polygonTestnetQuickswapFactoryAddress: string = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
    let polygonTestnetQuickswapRouterAddress: string = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
    let USDC: string = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    let USDCE: string = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    let WMATIC: string = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    let WETH: string = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
    let fixedPointMathContract = await engine.deployContract(networkId, fixedPointMathBlueprint);
    let fixedPointMathContractAsAny = (fixedPointMathContract as any);
    if (!fixedPointMathContract) throw new Error("missing fixed point math contract");
    let uniswapV2AdaptorContract = await engine.deployContract(networkId, uniswapV2AdaptorBlueprint, await fixedPointMathContract.getAddress(), polygonTestnetQuickswapFactoryAddress, polygonTestnetQuickswapRouterAddress);
    let uniswapV2AdaptorContractAsAny = (uniswapV2AdaptorContract as any);
    let price = await uniswapV2AdaptorContractAsAny.yield([WMATIC, WETH], {value: 1, decimals: 0});
    console.log(Number(price["0"]) / (10**18));
    let usdc = engine.newContract(networkId, ierc20, USDC);
    let wmatic = engine.newContract(networkId, ierc20, WMATIC);
    await usdc!.approve(await uniswapV2AdaptorContract!.getAddress(), 1000n * (10n**18n));
    await wmatic!.approve(await uniswapV2AdaptorContract!.getAddress(), 100000n * (10n**18n));
    let uniswapV2AdaptorContractSwapResponse = await uniswapV2AdaptorContractAsAny.swapExactTokensForTokens([WMATIC, WETH], {value: 1, decimals: 0});

    

}

main();