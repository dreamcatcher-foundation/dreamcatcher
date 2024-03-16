import * as Doka from "./code/framework/Doka/Doka.ts";

export const dokaConfig: Doka.LoaderPayload = {
    paths: {
        contracts: [],
        outDirFlat: "./code/contract/sol/dist/flat",
        outDirBytecode: "./code/contract/sol/dist/bytecode",
        outDirABI: "./code/contract/sol/dist/abi",
        outDirSelectors: "./code/contract/sol/dist/selectors"
    },
    networks: [{
        name: "polygon",
        rpcUrl: process.env.polygonRpcUrl!,
        privateKeys: [
            process.env.polygonPrivateKey!
        ]
    }, {
        name: "polygonTenderlyFork",
        rpcUrl: process.env.polygonTenderlyForkRpcUrl!,
        privateKeys: [
            process.env.polygonPrivateKey!
        ]
    }]
};