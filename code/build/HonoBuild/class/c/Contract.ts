import type {Provider} from "ethers";
import {type IProviderSubModule, ProviderSubModule} from "./ProviderSubModule.ts";
import {JsonRpcProvider, Wallet, Contract as EthersContract, BrowserProvider} from "ethers";

export interface IContract 
    extends IProviderSubModule {
    _contract?: EthersContract;
    _caller?: Wallet;
    _provider?: Provider;
    _address?: string;
    _ABI?: object[];
    _key?: string;
    _build: () => IContract;
}

export function Contract() {


    let instance = ({});

    instance = ({
        ...ProviderSubModule(instance)
    });

    function useEnvVarUrlJsonRpcProvider(envKey:string) {
        const url:undefined|string = process.env?.[envKey];
        
        if (!url) {
            throw new Error("Contract: env key references undefined url");
        }

        return useJsonRpcProvider(url);
    }

    function useJsonRpcProvider(url:string) {
        _provider = new JsonRpcProvider(url);
        return _build();
    }

    function useBrowserProvider() {
        const ethereum:undefined|any = (window as any).ethereum;
        
        if (!ethereum) {
            throw new Error("Contract: ethereum is undefined");
        }

        _provider = new BrowserProvider(ethereum);
        return _build();
    }

    function useProviderr(provider:Provider) {
        _provider = provider;
        return _build();
    }

    function useAddress(address:string) {
        _address = address;
        return _build();
    }

    function useABI(ABI:object[]) {
        _ABI = ABI;
        return _build();
    }

    function useKey(key:string) {
        _key = key;
        return _build();
    }

    function useEnvVarKey(envKey:string) {
        const key: string | undefined = process.env?.[envKey];
        if (!key) return instance;
        _key = key;
        return _build();
    }

    function useWallet(wallet:Wallet) {
        _wallet = wallet;
        return _build();
    }

    function _build() {
        if (_key) {
            _wallet = new Wallet(_key, _provider);
        }
        
        if (!_address) {
            return instance;
        }

        if (!_ABI) {
            return instance;
        }

        if (_wallet && _provider) {
            const signer:Wallet = _wallet.connect(_provider);
            _contract = new EthersContract(_address, _ABI, signer);
            return instance;
        }

        _contract = new EthersContract(_address, _ABI, _provider);
        return instance;
    }

    return instance;
}

function useProvider(parent: any) {
    let instance;

    function useEnvVarUrlJsonRpcProvider(envKey:string) {
        const url:undefined|string = process.env?.[envKey];
        
        if (!url) {
            throw new Error("Contract: env key references undefined url");
        }

        return useJsonRpcProvider(url);
    }

    function useJsonRpcProvider(url:string) {
        parent._provider = new JsonRpcProvider(url);
        return parent._build();
    }

    function useBrowserProvider() {
        const ethereum:undefined|any = (window as any).ethereum;
        
        if (!ethereum) {
            throw new Error("Contract: ethereum is undefined");
        }

        parent._provider = new BrowserProvider(ethereum);
        return parent._build();
    }

    function useProviderr(provider:Provider) {
        parent._provider = provider;
        return parent._build();
    }

    return instance;
}

Contract()