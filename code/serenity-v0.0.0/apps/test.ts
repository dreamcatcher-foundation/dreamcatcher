import { type Engine, type App, main} from '../engine/engine.ts';

const app: App = {
    contracts: [
        'Diamond',
        'DiamondFactory'
    ],
    fSrcDir: './code/contract/sol/dist',
    srcDir: './code/contract/sol/native/',
    networks: [{
        name: 'polygon',
        rpcUrl: process.env.polygonRpcUrl!,
        privateKey: process.env.polygonPrivateKey!
    }, {
        name: 'polygonTenderlyFork',
        rpcUrl: process.env.polygonTenderlyForkRpcUrl!,
        privateKey: process.env.polygonPrivateKey!
    }],
    program: Program,
    silence: false
}

function Program(engine: Engine): 0 | 1 {
    
    engine.deployContract('polygonTenderlyFork', 'DiamondFactory')
    .then(function(contract) {
        
    });

    return 1;
}

main(app);