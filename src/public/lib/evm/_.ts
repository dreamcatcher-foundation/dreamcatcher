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





export type SolcNumericTypeShard = "uint" | "int";

export type SolcNumericType = `${SolcNumericTypeShard}${SolcBitSize}`;
export type SolcEnum = "uint8";
export type SolcBytes = "bytes" | "bytes1" | "bytes2" | "bytes3"
export type SolcBaseDataType = "address" | "string" | "bool";
export type SolcArrayDataType = `${SolcBaseDataType | SolcNumericTypeShard}[]`;
export type SolcType = SolcNumericType | SolcBaseDataType | SolcArrayDataType | SolcStruct;
export type SolcStruct = SolcType[];






let x: SolcType = [["address"], ["address"]];


function Selector(_name: string, _args: SolcType[]) {

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

Selector("mint", [["address"], "uint256", ["uint120"]]);


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
