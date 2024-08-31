import type {ContractDeployTransaction} from "ethers";
import type {TransactionReceipt} from "ethers";
import {Contract, JsonRpcProvider} from "ethers";
import {Wallet} from "ethers";
import {require} from "@lib/ErrorHandler";


export interface Account {
    useKey(key: string): Account;
    useUrl(url: string): Account;
}

export function Account(_key: string, _url: string) {
    let _network: JsonRpcProvider | null = null;
    let _wallet: Wallet | null = null;

    async function address(): Promise<string> {
        require(!!_wallet, "account-wallet-not-available");
        return await _wallet!.getAddress();
    }





    return _;
}




export type SolcNumericDataTypeShard = "uint" | "int";
export type SolcNumericSizeTypeShard = "8" | "16" | "24" | "32" | "40" | "48" | "56" | "64" | "72" | "80" | "88" | "96" | "104" | "112" | "120" | "128" | "136" | "144" | "152" | "160" | "168" | "176" | "184" | "192" | "200" | "208" | "216" | "224" | "232" | "240" | "248" | "256";
export type SolcNumericDataType = `${SolcNumericDataTypeShard}${SolcNumericSizeTypeShard}`;
export type SolcDataTypeShard = "address" | "string";
export type SolcArrayDataType = `${SolcDataTypeShard | SolcNumericDataType}[]`;
export type SolcDataType = SolcNumericDataType | SolcDataTypeShard | SolcArrayDataType;

function Selector(_name: string, _args: SolcDataType[]) {

    function toSignature(): string {
        let args: string = "";
        for (let i = 0; i < _args.length; i += 1) {
            if (i !== 0) args += ", ";
            args += _args[i];
        }
        return `function ${name()}(${args}) external`;
    }

    function name(): string {
        return _name;
    }

    function args(): string[] {
        return _args;
    }

    return {toSignature, name, args};
}

Selector("mint", ["uint8"]);


function SignatureWithReturn(_selector: ReturnType<typeof Selector>, _return: string[]) {

}


function _parseNameFromSignature(signature: string): string {
    let shards: string[] = signature.split(" ");
    let shardsIsNotEmpty: boolean = shards.length !== 0;
    let shardsStartsWithFunctionKeyWord: boolean = shards[0] === "function";
    let name: string = shards[1].split("(")[0];
    require(shardsIsNotEmpty, "account-unable-to-parse-signature");
    require(shardsStartsWithFunctionKeyWord, "account-unable-to-parse-signature");
    return name;
}


console.log(_parseNameFromSignature("function name() external view returns (uint256)"));
