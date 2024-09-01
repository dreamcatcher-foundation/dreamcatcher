import {require} from "@lib/ErrorHandler";
import { JsonRpcProvider, Wallet } from "ethers";
import * as FileSystem from "fs";
import * as Path from "path";



export type DokaErrorCode
    =
    | "doka-compiler-missing-path";


export function Sol(_path: string) {


    function path(): string {
        return _path;
    }

    function bytecode(): string | null {

    }


}









export type BitSize
    =
    | "8" 
    | "16" 
    | "24" 
    | "32" 
    | "40" 
    | "48" 
    | "56" 
    | "64" 
    | "72" 
    | "80" 
    | "88" 
    | "96" 
    | "104" 
    | "112" 
    | "120" 
    | "128" 
    | "136" 
    | "144" 
    | "152" 
    | "160" 
    | "168" 
    | "176" 
    | "184" 
    | "192" 
    | "200" 
    | "208" 
    | "216" 
    | "224" 
    | "232" 
    | "240" 
    | "248" 
    | "256";

export type BytesBitSize
    =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "13"
    | "14"
    | "15"
    | "16"
    | "17"
    | "18"
    | "19"
    | "20"
    | "21"
    | "22"
    | "23"
    | "24"
    | "25"
    | "26"
    | "27"
    | "28"
    | "29"
    | "30"
    | "31"
    | "32";

export type ArithmeticBaseType
    =
    | "uint"
    | "int";

export type BytesBaseType 
    = "bytes";

export type BaseType = "address" | "string" | "bool";

export type ArithmeticType 
    = 
    | ArithmeticBaseType 
    | `${ArithmeticBaseType}${BitSize}`;

export type BytesType = BytesBaseType | `${BytesBaseType}${BytesBitSize}`

export type ArrayType = `${BaseType | ArithmeticType | BytesType}[]`;

export type Type = ArithmeticType | BytesType | BaseType | ArrayType | Struct;

export type Struct = Type[];


export type MSelector = `function ${string}(${string}) external`;


















export interface Selector {
    name(): string;
    args(): Type[];
    toSig(): string;
}

export function Selector(_name: string, ... _args: Type[]): Selector {

    function name(): string {
        return _name;
    }

    function args(): Type[] {
        return _args;
    }

    function toSig(): string {
        let args: string = "";
        for (let i = 0; i < _args.length; i += 1) {
            if (i !== 0) {
                args = ", ";
            }
            args += _args[i];
        }
        return `function ${name()}(${args}) external`;
    }

    return {name, args, toSig};
}

export interface SelectorWithResponse {
    name(): string;
    args(): Type[];
    response(): Type[];
    toSig(): string;
}

export function SelectorWithResponse(_name: string, _args: Type[], _response: Type[]): SelectorWithResponse {

    function name(): string {
        return _name;
    }

    function args(): Type[] {
        return _args;
    }

    function response(): Type[] {
        return _response;
    }

    function toSig(): string {
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

    return {name, args, response, toSig};
}




















/// takes in the url of a rpc provider to connect to a blockchain.
function EthereumVirtualMachine(_url: string) {
    let _network: JsonRpcProvider = new JsonRpcProvider(_url);

    /// from the evm you can log in as an account on that network
    /// and calls will be made through this key.
    function Account(_key: string) {
        let self;
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

        async function query(to: string, selector: SelectorWithResponse) {

        }

        return {address, nonce, nextNonce, query};
    }

    function Sol() {

    }

    async function chainId(): Promise<bigint> {
        return (await _network.getNetwork()).chainId;
    }

    return {Account};
}


interface Transaction {
    sign(account): unknown;
    send();
}



EthereumVirtualMachine("").Account("").query("", new SelectorWithResponse("previewMint", ["uint256"], ["uint256"]));






