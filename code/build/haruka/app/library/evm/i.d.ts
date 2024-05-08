


import SolidityPath from "../os/path/SolidityPath.ts";
import Path from "../os/path/Path.ts";
import Secret from "../os/Secret.ts";

const polygonTenderlyMainnetForkRPCURL: string = "https://rpc.tenderly.co/fork/03e55f5f-556a-4e77-befd-3db0d1761695";
const polygonTenderlyMainnetForkPrivateKey: Secret = new Secret("polygonTestnetPrivateKey");

function FunctionSignature(method: string, input: string, view?: boolean) {
    return `function ${method}(${input}) external ${view ? "view" : ""}`;
}

async function main() {
    const polygonEVM = await EthereumVirtualMachine(polygonTenderlyMainnetForkRPCURL, polygonTenderlyMainnetForkPrivateKey.get()!);
    const response = await polygonEVM.response("0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", ["function WETH() external view returns (address)"], "WETH");
    
}




function x({name, joe}: {name: string, joe: bigint}) {

}


x({
    name: "",
    joe: 5999n
});

import("../Timer.ts")
    .then(({default: Timer}) => {
        Timer;
        
    });



abstract class EthereumVirtualMachine {
    private _rpcNode: string;
    private _key: string;
}


async function EthereumVirtualMachisne(_rpcUrl: string, _privateKey: string) {

    const all = await import("fbemitter");
    const _ = {
        ...all
    };

    const x: {[k: string]: any} = {
        ..._
    }

    

    


    let _node: JsonRpcProvider;
    let _signer: Wallet;

    (function() {
        _node = new JsonRpcProvider(_rpcUrl);
        _signer = new Wallet(_privateKey, _node);
    })();

    async function response(address: string, abstractBinaryInterface: object[] | string[], method: string, ...args: any[]) {
        const contract = new EthersContract(address, abstractBinaryInterface, _signer);
        return await contract.getFunction(method)(...args);
    }

    async function Contract(abstractBinaryInterface: object[] | string[], bytecode: string, ...args: any[]) {
        const deployer = new ContractFactory(abstractBinaryInterface, bytecode, _signer);
        return await deployer.deploy(...args);
    }

    return {response, Contract};
}


"function foo(uint256) external";



import * as path from "path";

async function load(imports: string[], app: Function) {
    try {
        // Dynamically import the specified modules
        const importedModules = await Promise.all(imports.map(importPath => import(path.resolve(importPath))));

        // Destructure the modules
        const destructuredModules = importedModules.map(module => {
            const moduleKeys = Object.keys(module);
            return moduleKeys.reduce((acc, key) => {
                return { ...acc, [key]: module[key] };
            }, {});
        });

        // Call the app function with the destructured modules as arguments
        app(...destructuredModules);
    } catch (error) {
        console.error("Error loading modules:", error);
    }
}

// Usage
load([
    "../Timer.ts",
    "../../.ts"
], function({ Timer, React, useState }) {
    // Use Timer here
});
