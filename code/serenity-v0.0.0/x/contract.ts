import Web3, {
    Address,
    Address
} from "web3";

type HttpUrlLike = `http://${string}`;

type HttpsUrlLike = `https://${string}`;

type UrlLike = HttpUrlLike | HttpsUrlLike;

type AddressLike = `0x${string}`;

type Contract = {
    rpcUrl: () => string;
    address: () => string;
    application_binary_interface: () => unknown;
    set_rpc_url: (rpcUrl: string) => Contract;
    set_address: (address: string) => Contract;
    set_application_binary_interface: (applicationBinaryInterface: unknown) => Contract;
    build: () => Contract;
    query: (methodSignature: string, ...args: any[]) => Promise<any>;
}

function Contract() {
    let instance: Contract;

    return function() {
        type Memory = {
            rpcUrl: string;
            web3: Web3;
            address: string;
            applicationBinaryInterface: unknown;
            contract;
        }

        const memory = (function() {
            let instance: Memory;
            let web3: Web3;
            let contract: unknown;
            let rpcUrl: string;
            let address: string;
            let applicationBinaryInterface: unknown;

            return function() {
                if (!instance) {
                    return instance = {
                        rpcUrl,
                        web3,
                        address,
                        applicationBinaryInterface,
                        contract
                    };
                }
                return instance;
            }
        })();

        function rpcUrl(): string {
            return memory().rpcUrl;
        }

        function address(): string {
            return memory().address;
        }

        function applicationBinaryInterface(): unknown {
            return memory().applicationBinaryInterface;
        }

        function setRpcUrl(rpcUrl: string): Contract {
            memory().rpcUrl = rpcUrl;
            return instance;
        }

        function setAddress(address: string): Contract {
            memory().address = address;
            return instance;
        }

        function setApplicationBinaryInterface(applicationBinaryInterface: unknown): Contract {
            memory().applicationBinaryInterface = applicationBinaryInterface;
            return instance;
        }

        function build(): Contract {
            const memoryPointer: Memory = memory();
            memoryPointer.web3 = new Web3(rpcUrl());
            memoryPointer.contract = new memoryPointer.web3.eth.Contract(applicationBinaryInterface() as any, address());
            return instance;
        }

        async function query(methodSignature: string, ...args: any[]) {
            return memory().contract.methods[methodSignature](...args).call();
        }

        return instance = {
            rpcUrl,
            address,
            applicationBinaryInterface,
            setRpcUrl,
            setAddress,
            setApplicationBinaryInterface,
            build,
            query
        };
    }();
}

import {ERC20ABI} from "./ERC20ABI.ts";

function ERC20() {
    function totalSupply() {}
}

async function main() {
    const contract = Contract()
        .setRpcUrl(process.env.polygonRpcUrl!)
        .setAddress("0x7920BF274972D691714710F36D87B97b7Ac647cC")
        .setApplicationBinaryInterface(ERC20ABI())
        .build();
    const decimals: bigint = await contract.query("decimals");
    const number: bigint = await contract.query("totalSupply");
    console.log(_toReal(number, decimals).toLocaleString());
}

main();

function _toReal(number: bigint, decimals: bigint): number {
    const numberAsNumber: number = _toNumber(number);
    const decimalsAsNumber: number = _toNumber(decimals);
    
    function _toNumber(bigint: bigint): number {
        const string: string = bigint.toString();
        const cleanString: string = string.replace("n", "");
        const number: number = parseFloat(cleanString);
        return number;
    }

    return numberAsNumber / (10 ** decimalsAsNumber);
}