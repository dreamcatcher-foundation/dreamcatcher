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
            console.log(`deploying ${blueprint}`);
            const contract: IContract = await engine.deploy(networkId, blueprint);
            console.log(`deployed at ${await contract.getAddress()}`);
            return contract;
        }

        const authFacet:             IContract = await deploy_('AuthFacet');
        const managerAccessFacet:    IContract = await deploy_('ManagerAccessFacet');
        const marketFacet:           IContract = await deploy_('MarketFacet');
        const partialERC4626Facet:   IContract = await deploy_('PartialERC4626Facet');
        const rootAccessFacet:       IContract = await deploy_('RootAccessFacet');
        const tokenFacet:            IContract = await deploy_('TokenFacet');

        // 0xb357a8c23305f01dd0c5145ffc5d9797bd7e03b4 DiamondFactory

        const contract = engine.createContract(
            ...[
                'polygonTenderlyFork',
                'DiamondFactory',
                '0xb357a8c23305f01dd0c5145ffc5d9797bd7e03b4'
        ]);

        const deploymentPayload = {
            authFacet: '',
            managerAccessFacet: '',
            marketFacet: '',
            partialERC4626Facet: '',
            rootAccessFacet: '',
            tokenFacet: '',
            enabledTokens: [],
            asset: '',
            uniswapV2Factory: '',
            uniswapV2Router: '',
            maximumSlippageAsBasisPoint: 1000n,
            name: 'TestToken',
            symbol: 'vTT'
        }

        //await contract.deploy(deploymentPayload);
    }

    main();
    return true;
}

main(config);