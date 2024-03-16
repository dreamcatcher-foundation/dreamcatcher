import { doka } from '../../../framework/Doka/dokas.ts';

async function main(
    networkId: string,
    blueprint: string,
    pairs: object[],
    uniswapV2Factory: string,
    uniswapV2Router: string) {

    const contract = doka().deployContractAndBuildInterface(networkId, blueprint);

    /**
     * TODO Transfer from wallet to address to test swap. All other
     *      endpoints work as expected.
     */

    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i] as any;

        console.log(`
            Dataset
                NetworkId                        ${networkId}
                Blueprint                        ${blueprint}
                UniswapV2Factory                 ${uniswapV2Factory}
                UniswapV2Router                  ${uniswapV2Router}

            Pair
                Name                             ${pair.name}
                Token0                           ${pair.token0}
                Token1                           ${pair.token1}

            Response
                asV2PairAddress                  ${(await contract.call("asV2PairAddress", pair.token0, pair.token1, uniswapV2Factory)).content}
                asV2PairInterface                ${(await contract.call("asV2PairInterface", pair.token0, pair.token1, uniswapV2Factory)).content}
                reserves                         ${(await contract.call("reserves", pair.token0, pair.token1, uniswapV2Factory)).content}
                isZeroV2PairAddress              ${(await contract.call("isZeroV2PairAddress", pair.token0, pair.token1, uniswapV2Factory)).content}
                isSameLayoutAsV2PairInterface    ${(await contract.call("isSameLayoutAsV2PairInterface", pair.token0, pair.token1, uniswapV2Factory)).content}
                quote                            ${Number(((await contract.call("quote", pair.token0, pair.token1, uniswapV2Factory, uniswapV2Router)).content)) / (10**18)}
                out                              ${Number(((await contract.call("out", [pair.token0, pair.token1], uniswapV2Factory, uniswapV2Router, BigInt(1_0000_0000_0000_0000_00))).content)) / (10**18)}
                swap                             ${await contract.call("swap", [pair.token0, pair.token1], uniswapV2Factory, uniswapV2Router, BigInt(1_0000_0000_0000_0000_00))}
        `);
    }
}

main(
    "polygonTenderlyFork",
    "UniswapV2PairLibraryMockInterface",
    [{
        name: "ETH_USDT",
        token0: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        token1: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    }, {
        name: "WBTC_USDT",
        token0: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        token1: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    }, {
        name: "QUICK_USDT",
        token0: "0xB5C064F955D8e7F38fE0460C556a72987494eE17",
        token1: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    }],
    "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
    "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
);