import {BrowserProvider, Contract as EthersContract, JsonRpcSigner, Network} from "ethers";

export class compiler {
    private constructor() {}


}

export class Contract {

}

export class sentinel {
    private static _contract: EthersContract;
    private static _ABI: string;

}


export class gate {
    private static _provider: BrowserProvider;
    private static _signer: JsonRpcSigner;
    private static _network: Network;
    private static _supportedChainIds: bigint[];
    private static _sentinel: {[chainId: number]: string} = {};

    private constructor() {}

    public static get provider() {
        return gate._provider;
    }

    public static get signer() {
        return gate._signer;
    }

    public static get network() {
        return gate._network;
    }

    public static get supportedChainIds() {
        return gate._supportedChainIds;
    }

    public static get chainIdToSentinelMapping() {
        return gate._sentinel;
    }

    public static set supportedChainIds(chainIds: bigint[]) {
        gate._supportedChainIds = chainIds;
        return;
    }

    public static set sentinel(map: {[chainId: number]: string}) {
        gate._sentinel = map;
        return;
    }

    public static async connect() {
        gate._provider = new BrowserProvider(gate._METAMASK);
        gate._signer = await gate._provider.getSigner();
        gate._network = await gate._provider.getNetwork();
    }

    private static get _METAMASK() {
        return (window as any).ethereum;
    }
}