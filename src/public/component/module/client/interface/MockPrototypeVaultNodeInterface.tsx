import {query} from "@component/Client";
import {call} from "@component/Client";

export type Asset = [string, string, string[], string[], bigint];



class Node {

    public constructor(private address: string) {}

    public Child = class {
        public constructor(
            private readonly _deployer: string,
            private readonly _instance: string,
            private readonly _timestamp: bigint
        ) {}
    
        public deployer(): string {
            return this._deployer;
        }
    
        public instance(): string {
            return this._instance;
        }
    
        public timestamp(): bigint {
            return this._timestamp;
        }
    }

    public async children(): Promise<Node["Child"][]> {

        return [];
    }
}



export function MockPrototypeVaultNodeInterface(_address: string) {

    /***/ return {Child};

    function Child(_deployer: string, _instance: string, _timestamp: bigint) {
        
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



    async function children(): Promise<Child[]> {
        let response = (await query({
            to: _address,
            methodSignature: "function children() external view returns ((string, string, uint256)[])",
            methodName: "children"
        })) as [string, string, bigint][];
        let children: Child[] = [];
        for (let i = 0; i < response.length; i++) children.push(new Child(response[i][0], response[i][1], response[i][2]));
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

    return {children, vaultFactory, deploy};
}