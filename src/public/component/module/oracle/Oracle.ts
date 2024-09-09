import type {AxiosResponse} from "axios";
import {Erc20Interface} from "@component/Erc20Interface";
import {accountAddress} from "@component/Client";
import Axios from "axios";

export interface Token {
    name(): string;
    symbol(): string;
    totalSupply(): number;
    balance(): number;
}

export function Token(_name: string, _symbol: string, _totalSupply: number, _balance: number): Token {
    /***/ {
        return {name, symbol, totalSupply, balance};
    }
    function name(): string {
        return _name;
    }
    function symbol(): string {
        return _symbol;
    }
    function totalSupply(): number {
        return _totalSupply;
    }
    function balance(): number {
        return _balance;
    }
}

export interface Tokens {
    get(i: bigint): Promise<Token>;
    size(): bigint;
}

export async function Tokens(): Promise<Tokens> {
    let _tokens: string[];
    /***/ {
        _tokens = [];
        let url: string = "/tokens";
        let response: AxiosResponse = await Axios.get(url);
        let data: unknown = response.data;
        if (!Array.isArray(data)) throw Error("type-error");
        for (let i = 0; i < data.length; i++) if (typeof data[i] !== "string") throw Error("type-error");
        _tokens.push(... data);
        return {get, size};
    }
    async function get(i: bigint): Promise<Token> {
        let min: bigint = 0n;
        let max: bigint = BigInt(_tokens.length - 1);
        if (i < min) throw Error("out-of-bounds");
        if (i > max) throw Error("out-of-bounds");
        let token: Erc20Interface = Erc20Interface(_tokens[Number(i)]);
        let name: string = await token.name();
        let symbol: string = await token.symbol();
        let totalSupply: number = await token.totalSupply();
        let balance: number = 0;
        try {
            balance = await token.balanceOf(await accountAddress());
        }
        catch (e: unknown) {
            balance = 0;
        }
        return Token(name, symbol, totalSupply, balance);
    }
    function size(): bigint {
        return BigInt(_tokens.length);
    }
}