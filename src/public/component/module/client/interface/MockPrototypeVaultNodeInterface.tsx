import {query} from "@component/Client";
import {call} from "@component/Client";

export type Asset = [string, string, string[], string[], bigint];

export let node = MockPrototypeVaultNodeInterface("0x822f9650d41D2d649d96d3142CC17380f6Ab618F");

export function MockPrototypeVaultNodeInterface(_address: string) {

    /***/ return {size, child, vaultFactory, ownableTokenFactory, mint};

    async function size(): Promise<bigint> {
        return ((await query({
            to: _address,
            methodSignature: "function size() external view returns (uint256)",
            methodName: "size"
        })) as bigint);
    }

    async function child(i: bigint): Promise<[string, string]> {
        return (await query({
            to: _address,
            methodSignature: "function child(uint256) external view returns ((address, address))",
            methodName: "child",
            methodArgs: [i]
        })) as [string, string];
    }

    async function vaultFactory(): Promise<string> {
        return (await query({
            to: _address,
            methodSignature: "function vaultFactory() external view returns (address)",
            methodName: "vaultFactory"
        })) as string;
    }

    async function ownableTokenFactory(): Promise<string> {
        return (await query({
            to: _address,
            methodSignature: "function ownableTokenFactory() external view returns (address)",
            methodName: "ownableTokenFactory"
        })) as string;
    }

    async function mint(name: string, symbol: string, assets: Asset[]) {
        return await call({
            to: _address,
            methodSignature: "function mint(string,string,(address,address,address[],address[],uint256)[]) external",
            methodName: "mint",
            methodArgs: [name, symbol, assets]
        })
    }
}