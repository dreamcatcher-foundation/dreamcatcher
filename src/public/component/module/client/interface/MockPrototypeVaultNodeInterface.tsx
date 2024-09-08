import {query} from "@component/Client";
import {call} from "@component/Client";

export type Asset = [string, string, string[], string[], bigint];

export let node = MockPrototypeVaultNodeInterface("0xd5E97178fBa5A760d23c81D79d0dBFFdEA1bE844");

export interface MockPrototypeVaultNodeChild {
    deployer(): string;
    instance(): string;
    timestamp(): bigint;
}

export function MockPrototypeVaultNodeChild(_deployer: string, _instance: string, _timestamp: bigint): MockPrototypeVaultNodeChild {

    /***/ return {deployer, instance, timestamp};

    function deployer(): string {
        return _deployer;
    }

    function instance(): string {
        return _instance;
    }

    function timestamp(): bigint {
        return _timestamp;
    }
}

export function MockPrototypeVaultNodeInterface(_address: string) {

    /***/ return {children, vaultFactory, ownableTokenFactory, deploy};

    async function children(): Promise<MockPrototypeVaultNodeChild[]> {
        let response = (await query({
            to: _address,
            methodSignature: "function children() external view returns ((string, string, uint256)[])",
            methodName: "children"
        })) as [string, string, bigint][];
        let children: MockPrototypeVaultNodeChild[] = [];
        for (let i = 0; i < response.length; i++) children.push(MockPrototypeVaultNodeChild(response[i][0], response[i][1], response[i][2]));
        return children;
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
            methodSignature: "function deploy(string,string,(address,address,address[],address[],uint256)[])",
            methodName: "deploy",
            methodArgs: [name, symbol, assets]
        })
    }
}