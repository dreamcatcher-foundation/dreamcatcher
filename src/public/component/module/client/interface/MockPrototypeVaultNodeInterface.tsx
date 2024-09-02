import {query} from "@component/Client";
import {call} from "@component/Client";

export type Asset = {
    token: string;
    currency: string;
    tknCurPath: string[];
    curTknPath: string[];
    targetAllocation: bigint;
}

export function MockPrototypeVaultNodeInterface(_address: string) {

    async function deployed(): Promise<string[]> {
        return (await query({
            to: _address,
            methodSignature: "function deployed() external view returns (address[])",
            methodName: "deployed"
        })) as string[];
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

    async function deploy(name: string, symbol: string, assets: Asset[]) {
        return await call({
            to: _address,
            methodSignature: "function deploy(string, string, [address, address, address[], address[], uint256][])",
            methodName: "deploy",
            methodArgs: [name, symbol, assets]
        })
    }

    return {deployed, vaultFactory, deploy};
}