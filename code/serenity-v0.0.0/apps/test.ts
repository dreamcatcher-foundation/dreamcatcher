import { type IEngine, type IConfig, main} from "../engine/engine.ts";
import * as Ethers from "ethers";

const config: IConfig = {
    contracts: [{
        name: "Diamond",
        path: "./code/contract/sol/native/solidstate/Diamond.sol"
    }, {
        name: "DiamondFactory",
        path: "./code/contract/sol/native/solidstate/DiamondFactory.sol"
    }, {
        name: "AuthFacet",
        path: "./code/contract/sol/native/facet/AuthFacet.sol"
    }, {
        name: "ManagerAccessFacet",
        path: "./code/contract/sol/native/facet/ManagerAccessFacet.sol"
    }, {
        name: "MarketFacet",
        path: "./code/contract/sol/native/facet/MarketFacet.sol"
    }, {
        name: "PartialERC4626Facet",
        path: "./code/contract/sol/native/facet/PartialERC4626Facet.sol"
    }, {
        name: "RootAccessFacet",
        path: "./code/contract/sol/native/facet/RootAccessFacet.sol"
    }, {
        name: "TokenFacet",
        path: "./code/contract/sol/native/facet/TokenFacet.sol"
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

function App(engine: IEngine): boolean {
    
    async function main() {
        const networkId: string = 'polygonTenderlyFork';

        type IContract = Ethers.BaseContract & {deploymentTransaction(): Ethers.ContractTransactionResponse;} & Omit<Ethers.BaseContract, keyof Ethers.BaseContract>;

        async function deploy_(blueprint: string): Promise<IContract> {
            const contract: IContract = await engine.deploy(networkId, blueprint);
            console.log(`deployed ${blueprint} at ${await contract.getAddress()}`);
            return contract;
        }

        console.log("deploying facets");

        const authFacet: IContract = await deploy_('AuthFacet');
        const managerAccessFacet: IContract = await deploy_('ManagerAccessFacet');
        const marketFacet: IContract = await deploy_('MarketFacet');
        const partialERC4626Facet: IContract = await deploy_('PartialERC4626Facet');
        const rootAccessFacet: IContract = await deploy_('RootAccessFacet');
        const tokenFacet: IContract = await deploy_('TokenFacet');

        console.log("deploying diamond");
        const diamond: IContract = await deploy_("Diamond");

        async function install_(contract: IContract, tag: string) {
            await (diamond as any).install(await contract.getAddress());
            console.log(`installed ${tag}`);
        }

        await install_(authFacet, "AuthFacet");
        await install_(managerAccessFacet, "ManagerAccessFacet");
        await install_(marketFacet, "MarketFacet");
        await install_(partialERC4626Facet, "PartialERC4626Facet");
        await install_(rootAccessFacet, "RootAccessFacet");
        await install_(tokenFacet, "TokenFacet");

        const diamondFactory = await deploy_("DiamondFactory");
        //const diamondFactory = engine.createContract(networkId, "DiamondFactory", "0x61357df5ef8580b4dc09f151b3a9e533002f35f3");

        const quickswapRouter = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
        const quickswapFactory = "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";

        const WBTC = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
        const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

        const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

        console.log("generating payload");
        const deploymentPayload = {
            authFacet: await authFacet.getAddress(),
            managerAccessFacet: await managerAccessFacet.getAddress(),
            marketFacet: await marketFacet.getAddress(),
            partialERC4626Facet: await partialERC4626Facet.getAddress(),
            rootAccessFacet: await rootAccessFacet.getAddress(),
            tokenFacet: await tokenFacet.getAddress(),
            enabledTokens: [
                WBTC,
                WETH
            ],
            asset: USDT,
            uniswapV2Factory: quickswapFactory,
            uniswapV2Router: quickswapRouter,
            maximumSlippageAsBasisPoint: 1000n,
            name: 'TestToken',
            symbol: 'vTT'
        }

        console.log("deploying diamond through diamond factory");
        await (diamondFactory as any).deploy(deploymentPayload);

        //console.log("diamond deployed");
    }

    main();
    return true;
}

main(config);