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
    let polygonTestnetQuickswapFactoryAddress: string = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
    let polygonTestnetQuickswapRouterAddress: string = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
    let fixedPointMathContract = await engine.deployContract(networkId, fixedPointMathBlueprint);
    let fixedPointMathContractAsAny = (fixedPointMathContract as any);
    if (!fixedPointMathContract) throw new Error("missing fixed point math contract");
    console.log("testing fixed point math scale");
    let fixedPointMathContractScaleResponse = await fixedPointMathContractAsAny.scale({value: 200, decimals: 0}, {value: 200, decimals: 0});
    console.log(fixedPointMathContractScaleResponse["0"], fixedPointMathContractScaleResponse["1"]);
    //console.log("testing fixed point math sluce");
    //let fixedPointMathContractSliceResponse = await fixedPointMathContractAsAny.slice({value: 200, decimals: 0}, {value: 5000, decimals: 0});
    //console.log(fixedPointMathContractSliceResponse["0"], fixedPointMathContractSliceResponse["1"]);
    //console.log("testing fixed point math add");
    //let fixedPointMathContractAddResponse = await fixedPointMathContractAsAny.add({value: 200, decimals: 0}, {value: 200, decimals: 0});
    //console.log(fixedPointMathContractAddResponse["0"], fixedPointMathContractAddResponse["1"]);
}

main();