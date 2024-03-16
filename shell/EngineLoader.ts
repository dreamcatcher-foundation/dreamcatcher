import { Loader } from './Engine.ts';
import { Loaded } from './Engine.ts';

function app(loaded: Loaded): void {
    
    return;
}

export const loader: Loader = {
    'srcDir': './code/contract/sol/native/',
    'fsrcDir': './code/contract/sol/dist/',
    'contractIds': [
        'Diamond'
    ],
    'app': app,
    'networks': [{
        'name': 'polygon',
        'rpcUrl': process.env.polygonRpcUrl!,
        'privateKeys': [
            process.env.polygonPrivateKey!
        ]
    }, {
        'name': 'polygonTenderlyFork',
        'rpcUrl': process.env.polygonTenderlyForkRpcUrl!,
        'privateKeys': [
            process.env.polygonPrivateKey!
        ]
    }]
}