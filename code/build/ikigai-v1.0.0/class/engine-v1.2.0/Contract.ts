import type {Provider} from "ethers";
import {Contract as EthersContract, JsonRpcProvider, BrowserProvider, Wallet} from "ethers";
import {expect, wrap} from "./ErrorHandling.ts";

type Key = (string & {__type: "Key"});

function Key(key: string) {
    return key as Key;
}

function EnvVarKey(envkey: string) {
    return wrap<string>(function() {
        const key = process.env?.[envkey];
        const hasKey = !!key;
        expect(hasKey, "missing env reference");
        return key! as Key;
    });
}

function Caller(key: Key) {
    

    function _instance() {
        return ({
            
        });
    }

    return _instance();
}

const caller = Caller(Key(""));


function Contract() {
    let _inner: EthersContract;

    async function address(): Promise<string> {
        return await _inner.getAddress();
    }

    async function bytecode(): Promise<string | null> {
        return await _inner.getDeployedCode();
    }

    async function call(method: string, ...args: unknown[]): Promise<unknown> {
        return await _inner.getFunction(method)(...args);
    }

    function useBrowserProvider() {

    }
}






export type IBlockchainArgs = ({
    rpcUrl?: string;
    envVarRpcUrl?: never;
    useBrowserProvider?: never;
    provider?: never;
} | {
    rpcUrl?: never;
    envVarRpcUrl?: string;
    useBrowserProvider?: never;
    provider?: never;
} | {
    rpcUrl?: never;
    envVarRpcUrl?: never;
    useBrowserProvider?: true;
    provider?: never
} | {
    rpcUrl?: never;
    envVarRpcUrl?: never;
    useBrowserProvider?: never;
    provider?: Provider;
});


new EthersContract()






export type IContractAsrgs = ({
    address: string;
    ABI: object[];
} & ({
    rpcUrl?: string;
    envVarRpcUrl?: never;
    useBrowserProvider?: never;
    provider?: never;
} | {
    rpcUrl?: never;
    envVarRpcUrl?: string;
    useBrowserProvider?: never;
    provider?: never;
} | {
    rpcUrl?: never;
    envVarRpcUrl?: never;
    useBrowserProvider?: true;
    provider?: never
} | {
    rpcUrl?: never;
    envVarRpcUrl?: never;
    useBrowserProvider?: never;
    provider?: Provider;
}) & ({
    key?: string;
    envVarKey?: never;
} | {
    key?: never;
    envVarKey?: string;
}));

export function Contrasct() {
    let _provider: Provider | undefined;
    let _key: string | undefined;
    let _caller: Wallet | undefined;
    let _inner: EthersContract;
    let _address: string;
    let _ABI: object[];

    /// ---------------------------------------------------------------------------------------------------------
    function useAddress(address: string) {
        _address = address;
        return ({
            useABI
        });
    }

    function useABI(ABI: object[]) {
        _ABI = ABI;
        return chooseProvider();
    }

    /// ---------------------------------------------------------------------------------------------------------
    function chooseProvider() {
        return ({
            useEnvVarUrlProvider,
            useJsonRpcProvider,
            useBrowserProvider,
            useProvider,
            noProvider
        });
    }

    function useEnvVarUrlProvider(envkey: string) {
        const url: string | undefined = process.env?.[envkey];
        const hasUrl: boolean = !!url;
        expect(hasUrl, "missing url");
        return useJsonRpcProvider(url!);
    }

    function useJsonRpcProvider(url: string) {
        _provider = new JsonRpcProvider(url);
        return chooseCaller();
    }   

    function useBrowserProvider() {
        const ethereum: any = (window as any).ethereum;
        _provider = new BrowserProvider(ethereum);
        return chooseCaller();
    }
    
    function useProvider(provider: Provider) {
        _provider = provider;
        return chooseCaller();
    }

    function noProvider() {
        _provider = undefined;
        return chooseCaller();
    }

    /// ---------------------------------------------------------------------------------------------------------
    function chooseCaller() {
        return ({
            useKey,
            useEnvVarKey,
            noKey
        });
    }

    function useKey(key: string) {
        _key = key;
        return chooseContract();
    }

    function useEnvVarKey(envkey: string) {
        const key: string | undefined = process.env?.[envkey];
        const hasKey: boolean = !!key;
        expect(hasKey, "missing key");
        return chooseContract();
    }

    function noKey() {
        _key = undefined;
        return chooseContract();
    }

    /// ---------------------------------------------------------------------------------------------------------
    function chooseContract() {
        return ({
            useNewContract,
            useContract
        });
    }

    function useNewContract() {
        return ({build});
    }

    function useContract(contract: EthersContract) {
        _inner = contract;
        return ({build});
    }

    function build() {
        
    }

    return ({
        useAddress
    });
}

Contract()
    .useAddress("")
    .useABI([])
    .useBrowserProvider()
    .useKey("")
    .useNewContract()
    .build();
    