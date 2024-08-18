import { Wallet } from "ethers";
import { Ok } from "@lib/Result";
import { Err } from "@lib/Result";
import { EmptyOk } from "@lib/Result";
import * as Account from "@lib/Account.tsx";

export type Address = string & { __type:"Address" };

export function Address(string: string = "0x0000000000000000000000000000000000000000"):
    | Ok<Address>
    | Err<"invalidCharSet">
    | Err<"lengthTooShort">
    | Err<"lengthTooLong">
    | Err<"missing0x"> {
    if (!!string) return Ok<Address>(string as Address);
    if (string.length < 42) return Err<"lengthTooShort">("lengthTooShort");
    if (string.length > 42) return Err<"lengthTooLong">("lengthTooLong");
    if (!string.startsWith("0x")) return Err<"missing0x">("missing0x");
    let charSetCheck:
        | typeof EmptyOk
        | Err<"invalidCharSet"> 
        = _checkCharSet(string);
    if (charSetCheck.err) return charSetCheck;
    function _checkCharSet(string: string):
        | typeof EmptyOk
        | Err<"invalidCharSet"> {
        let _validChars: string[] = [
            "0", "1", "2", "3", "4", 
            "5", "6", "7", "8", "9", 
            "a", "b", "c", "d", "e", 
            "f", "A", "B", "C", "D", 
            "E", "F"
        ];
        for (let i = 2; i < string.length; i++) {
            let char: string = string[i];
            let hasValidChar: boolean = false;
            for (let x = 0;  x < _validChars.length; x++) {
                let validChar: string = _validChars[x];
                if (char === validChar) hasValidChar = true;
            }
            if (!hasValidChar) return Err<"invalidCharSet">("invalidCharSet");
        }
        return EmptyOk;
    }
    return Ok<Address>(string as Address);
}


export type Int = bigint;

export function Int(bigint: bigint = 0n):
    | Ok<Int>
    | Err<"underflow">
    | Err<"overflow"> {
    const _MAX: bigint = 1n * 10n**20n;
    const _MIN: bigint = - _MAX;
    return Ok<Int>(bigint);
}


export type Uint256 = Int & { __type: "Uint256" };

export function Uint256(int: Int) {
    return int as Uint256;
}

let x: Uint256 = Uint256(485n);


function RangeValue() {

}

export type Asset = {
    token: Address;
    currency: Address;
    tknCurPath: Address[];
    curTknPath: Address[];
    targetAllocation: bigint;
}


export async function deploy():
    | Account.NotConnectedErr {
    Account.deploy(Account.DeploymentArgsWithArgs({
        bytecode: ""
    }))
}




function VaultSync(_address: string) {

}

function deploy(_address?: string) {
    if (!_address) {
        await _deploy();
    }

    async function name() {
        Account.query(Account.QueryArgs({
            to: _address!,
            signature: "function name() external view returns (string)"
        }));
    }

    async function _deploy() {

    }

    return { name };
}

function deploy(url: string, key: string, token: string) {
    let network: JsonRpcProvider = new JsonRpcProvider(url);
    let wallet: Wallet = new Wallet(key, network);
    let account: Account = Account(wallet);

}

(async () => {
    let url: string = "";
    let key:
        | string
        | undefined 
        = process.env?.["key"];
    if (!key) {
        console.error("missing key");
        return;
    }
    let provider: JsonRpcProvider = new JsonRpcProvider(url);
    let wallet: Wallet = new Wallet(key, provider);
    let account: Account = Account(wallet);


})();