import { type IEngine, type IConfig, main} from "../engine/engine.ts";
import * as Ethers from "ethers";

const config: IConfig = {
    contracts: [{
        name: "UniswapV2PairAdaptorLibTest",
        path: "./code/contract/sol/native/util/UniswapV2PairAdaptorLib.sol"
    }],
    fSrcDir: "./code/contract/sol/dist",
    networks: [{
        name: "polygon",
        rpcUrl: process.env.polygonRpcUrl!,
        privateKey: process.env.polygonPrivateKey!
    }, {
        name: "polygonTenderlyFork",
        rpcUrl: process.env.polygonTenderlyForkRpcUrl!,
        privateKey: process.env.polygonPrivateKey!
    }],
    app: App,
    silence: false
}

namespace PolygonToken {
    export const WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    export const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
    export const USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    export const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
    export const QUICK = "0xB5C064F955D8e7F38fE0460C556a72987494eE17";
    export const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
    export const WBTC = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
    export const A51 = "0xe9E7c09e82328c3107d367f6c617cF9977e63ED0";
    export const AAVE = "0xD6DF932A45C0f255f85145f286eA0b292B21C90B";
    export const ABOND = "0xe6828D65bf5023AE1851D90D8783Cc821ba7eeE1";
    export const ALI = "0xbFc70507384047Aa74c29Cdc8c5Cb88D0f7213AC";
}

const polygonTokens = [
    PolygonToken.WMATIC,
    PolygonToken.DAI,
    PolygonToken.USDC,
    PolygonToken.USDT,
    PolygonToken.QUICK,
    PolygonToken.WETH,
    PolygonToken.WBTC,
    PolygonToken.A51,
    PolygonToken.AAVE,
    PolygonToken.ABOND,
    PolygonToken.ALI
]

function App(engine: IEngine): boolean {
    
    async function main() {
        const networkid_: string = "polygonTenderlyFork";

        async function test(blueprint: string, fn: (contract: any) => any) {
            console.log(`testing ${blueprint}`);
            const contract = await deploy_(blueprint);
            fn(contract);
        }

        async function deploy_(blueprint: string) {
            console.log(`deploying ${blueprint}`);
            const contract_ = await engine.deploy(networkid_, blueprint);
            console.log(`deployed ${blueprint} at ${await contract_.getAddress()}`);
            return contract_;
        }

        test("UniswapV2PairAdaptorLibTest", async function(contract) {
            for (let i = 0; i < polygonTokens.length; i++) {
                try {
                    const payload = {
                        token0: polygonTokens[i],
                        token1: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                        router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
                        factory: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"
                    }


                    const price_ = await contract.price(payload);
                    
                    const pathPayload = {
                        path: [
                            polygonTokens[i],
                            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
                        ],
                        router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
                        factory: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
                        amountIn: 1n * (10n**18n)
                    }

                    const amountOut_ = await contract.amountOut(pathPayload);
                    const slippage_ = await contract.slippage(pathPayload);
                    
                    consoleLogN(price_);
                    consoleLogN(amountOut_);
                    console.log(slippage_);
                } catch (error) {
                    console.log(error);
                }
            }

            function consoleLogN(number: bigint) {
                console.log(Number(number) / (10**18));
            }
        });
    }

    main();
    return true;
}

main(config);