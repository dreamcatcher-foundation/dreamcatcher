import { Host } from "@atlas/class/host/Host.ts";

console.log(((await new Host.Transaction({
    rpcUrl: "https://polygon-rpc.com",
    privateKey: (new Host.Secret("polygonPrivateKey")).resolve().unwrap(),
    gasPrice: "standard",
    methodSignature: "function deploy(string) external returns (address)",
    methodName: "deploy",
    methodArgs: [
        "FirstTest#0"
    ],
    to: "0x4e1e7486b0af43a29598868B7976eD6A45bc40dd",
    confirmations: 1n,
    chainId: 137n,
    value: 0n
}).receipt()).unwrap()));