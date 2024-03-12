export const config = {
    'path': {
        'contracts': [
            './code/contract/sol/native/mock/UniswapV2PairLibraryMockInterface.sol'
        ],
        'outDirFlat': './code/contract/sol/dist/flat',
        'outDirBytecode': './code/contract/sol/dist/bytecode',
        'outDirABI': './code/contract/sol/dist/abi',
        'outDirSelectors': './code/contract/sol/dist/selectors'
    },
    'networks': [{
        'name': 'polygon',
        'rpcUrl': process.env.polygonRpcUrl,
        'wallets': [process.env.polygonPrivateKey]
    }, {
        'name': 'polygonTenderlyFork',
        'rpcUrl': process.env.polygonTenderlyForkRpcUrl,
        'wallets': [process.env.polygonPrivateKey]
    }]
} as const;