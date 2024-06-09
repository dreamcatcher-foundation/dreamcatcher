import { Host } from "@atlas/class/host/Host.ts";

((await new Host.Transaction({
    rpcUrl: "https://polygon-rpc.com",
    privateKey: (new Host.Secret("polygonPrivateKey")).resolve().unwrap(),
    gasPrice: "standard",
    methodSignature: "function transferOwnership(address) external",
    methodName: "transferOwnership",
    methodArgs: [
        "0x4e1e7486b0af43a29598868B7976eD6A45bc40dd"
    ],
    to: "0x49dABC96174Ae8Df1b5b6a6823199D029A54aE86",
    confirmations: 1n,
    chainId: 137n,
    value: 0n
}).receipt()).unwrap())?.hash;