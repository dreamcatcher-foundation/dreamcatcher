import {require} from "@lib/ErrorHandler";
import {Contract} from "ethers";
import { JsonRpcProvider, Wallet } from "ethers";
import * as FileSystem from "fs";
import * as Path from "path";

export type DokaErrorCode = 
    | "sol-missing-path"
    | "sol-failed-to-parse-file-name"
    | "sol-failed-to-parse-file-extension"
    | "sol-failed-to-parse-file-content"
    | "sol-type-error";

export type SelectorBitSize = 
    | "8" 
    | "16" | "24" | "32" 
    | "40" | "48" | "56" 
    | "64" | "72" | "80" 
    | "88" | "96" 
    | "104" | "112" | "120" 
    | "128" | "136" | "144" 
    | "152" | "160" | "168" 
    | "176" | "184" | "192" 
    | "200" | "208" | "216" 
    | "224" | "232" | "240" 
    | "248" | "256";

export type SelectorBytesBitSize = 
    | "1" | "2" | "3" 
    | "4" | "5" | "6" 
    | "7" | "8" | "9" 
    | "10" | "11" | "12" 
    | "13" | "14" | "15" 
    | "16" | "17" | "18" 
    | "19" | "20" | "21" 
    | "22" | "23" | "24" 
    | "25" | "26" | "27" 
    | "28" | "29" | "30" 
    | "31" | "32";

export type SelectorArithmeticType = "uint" | "int" | `${"uint" | "int"}${SelectorBitSize}`;

export type SelectorBytesType = "bytes" | `bytes${SelectorBytesBitSize}`;

export type SelectorBaseType = 
    | "address" 
    | "string" 
    | "bool";

export type SelectorArrayType = `${SelectorArithmeticType | SelectorBytesType | SelectorBaseType}[]`;

export type SelectorStructType = SelectorType[];

export type SelectorType = 
    | SelectorArithmeticType 
    | SelectorBaseType 
    | SelectorArrayType 
    | SelectorStructType;

export type SelectorSignature = `function ${string}(${string}) external`;

export type SelectorSignatureWithResponse = `function ${string}(${string}) external view returns (${string})`;

export type Selector = {
    name(): 
        string;
    args(): 
        SelectorType[];
    toSignature(): 
        SelectorSignature;
}

export type SelectorWithResponse = {
    name(): 
        string;
    args(): 
        SelectorType[];
    response(): 
        SelectorType[];
    toSignature(): 
        SelectorSignatureWithResponse;   
}

export function Selector(_name: string, ... _args: SelectorType[]): Selector {

    function name(): string {
        return _name;
    }

    function args(): SelectorType[] {
        return _args;
    }

    function toSignature(): SelectorSignature {
        let args: string = "";
        for (let i = 0; i < _args.length; i += 1) {
            if (i !== 0) {
                args = ", ";
            }
            args += _args[i];
        }
        return `function ${name()}(${args}) external`;
    }

    return {name, args, toSignature};
}

export function SelectorWithResponse(_name: string, _args: SelectorType[], _response: SelectorType[]): SelectorWithResponse {

    function name(): string {
        return _name;
    }

    function args(): SelectorType[] {
        return _args;
    }

    function response(): SelectorType[] {
        return _response;
    }

    function toSignature(): SelectorSignatureWithResponse {
        let args: string = "";
        for (let i = 0; i < _args.length; i += 1) {
            if (i !== 0) {
                args = ", ";
            }
            args += _args[i];
        }
        let response: string = "";
        for (let i = 0; i < _response.length; i += 1) {
            if (i !== 0) {
                response = ", ";
            }
            response += _response[i];
        }
        return `function ${_name}(${args}) external view returns (${response})`;
    }

    return {name, args, response, toSignature};
}











export function EthereumVirtualMachine(_url: string) {
    let _network: JsonRpcProvider = new JsonRpcProvider(_url);

    function Account(_key: string) {
        let _wallet: Wallet = new Wallet(_key, _network);

        async function address(): Promise<string> {
            return await _wallet.getAddress();
        }

        async function nonce(): Promise<number> {
            return await nextNonce() - 1;
        }

        async function nextNonce(): Promise<number> {
            return await _wallet.getNonce();
        }

        async function query(to: string, selector: SelectorWithResponse, ... args: unknown[]) {
            return await new Contract(to, [selector.toSignature()], _wallet).getFunction(selector.name())(... args);
        }

        interface InvokeRequest {
            to: string;
            selector: Selector;
            args?: unknown[];
            gasPrice?: bigint;
            gasLimit?: bigint;
            value?: bigint;
            chainId?: bigint;
            confirmations?: bigint;
        }

        async function invoke(request: InvokeRequest) {
            return await (await _wallet.sendTransaction({
                from: await address(),
                to: request.to,
                nonce: await nextNonce(),
                gasPrice: request.gasPrice,
                gasLimit: request.gasLimit,
                chainId: request.chainId,
                value: request.value,
                data: ""
            })).wait(Number(request.confirmations));
        }

        return {address, nonce, nextNonce, query, invoke};
    }

    function Sol() {

    }

    async function chainId(): Promise<bigint> {
        return (await _network.getNetwork()).chainId;
    }

    return {Account, Sol, chainId};
}




EthereumVirtualMachine("")
    .Account("")
    .invoke({
        to: "",
        selector: Selector("", []),
        args: [],
        
    })
