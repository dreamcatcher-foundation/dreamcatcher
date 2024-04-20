import type {Provider} from "ethers";
import {Contract, JsonRpcProvider, BrowserProvider, Wallet} from "ethers";
import {post} from "./Emitter.ts";

export function Address() {
    let _contract: Contract | undefined = undefined;
    let _caller: Wallet | undefined = undefined;
    let _provider: Provider | undefined = undefined;
    let _key: string | undefined = undefined;
    let _address: string | undefined = undefined;

    const instance = ({});

    function useAddress(address: string) {
        _address = address;
        return instance;
    }

    function useKey(key: string) {
        _key = key;
        return instance;
    }

    function useEnvVarKey(envKey: string) {
        const key: string | undefined = process.env?.[envKey];
        
        if (!key) {
            post()
                .useSocket("Address")
                .useMessage("MissingKey")
                .useArgs(instance)
                .useTimeout(0n)
                .execute();
            
            return instance;
        }

        _key = key;
        return instance;
    }
}




/**
 * 0: provider
 * 1: caller
 * 2: contract
 */
export function Addresss() {
    let _contract: Contract | undefined;
    let _caller: Wallet | undefined;
    let _provider: JsonRpcProvider | BrowserProvider | Provider | undefined;

    const instance = ({
        _contract,
        _caller,
        _provider,
        contract,
        caller,
        provider,
        bindProvider,
        bindContract,
        bindCaller,
        call
    });

    function contract() {
        return _contract;
    }

    function caller() {
        return _caller;
    }

    function provider() {
        return _provider;
    }

    function bindProvider() {
        return bindProviderFlow(instance)();
    }

    function bindContract() {
        return bindContractFlow(instance)();
    }

    function bindCaller() {
        return bindCallerFlow(instance)();
    }

    function call() {
        return callFlow(instance)();
    }

    return instance;
}

function bindProviderFlow(parent: ReturnType<typeof Address>) {
    return function bindProvider() {
        const instance = ({
            useJsonRpcEnvUrl,
            useJsonRpc,
            useBrowser,
            use,
            _
        });

        function useJsonRpcEnvUrl(envKey: string) {
            const url: string | undefined = process.env?.[envKey];
            if (!url) throw new Error("bindProviderFlow: env key points to undefined url");
            return useJsonRpc(url);
        }

        function useJsonRpc(url: string) {
            parent._provider = new JsonRpcProvider(url);
            return _();
        }

        function useBrowser() {
            const ethereum: any = (window as any).ethereum;
            parent._provider = new BrowserProvider(ethereum);
            return _();
        }

        function use(provider: Provider) {
            parent._provider = provider;
            return _();
        }

        function _() {
            return parent;
        }

        return instance;
    }
}

function bindContractFlow(parent: ReturnType<typeof Address>) {
    return function bindContract() {
        const instance = ({
            useAddress,
            useABI,
            bind
        });

        let _address: string | undefined;
        let _ABI: object[] | undefined;

        function useAddress(address: string) {
            _address = address;
            return instance;
        }

        function useABI(ABI: object[]) {
            _ABI = ABI;
            return instance;
        }

        function bind(contract?: Contract) {
            if (contract) parent._contract = contract;
            if (!_address) throw new Error("bindContractFlow: missing address");
            if (!_ABI) throw new Error("bindContractFlow: missing ABI");
            if (parent._caller && parent._provider) {
                parent._contract = new Contract(_address, _ABI, parent._caller.connect(parent._provider));
                return parent;
            }
            parent._contract = new Contract(_address, _ABI, parent._provider);
            return parent;
        }

        return instance;
    }
}

function bindCallerFlow(parent: ReturnType<typeof Address>) {
    return function bindCaller() {
        const instance = ({
            useKey,
            useEnvVarKey,
            bind
        });

        let _key: string | undefined;

        function useKey(key: string) {
            _key = key;
            return instance;
        }

        function useEnvVarKey(envKey: string) {
            const key: string | undefined = process.env?.[envKey];
            if (!key) return instance;
            _key = key;
            return instance;
        }

        function bind(wallet?: Wallet) {
            if (wallet) parent._caller = wallet;
            if (!_key) throw new Error("bindCallerFlow: missing key");
            parent._caller = new Wallet(_key, parent._provider);
            return parent;
        }

        return instance;
    }
}

function callFlow(parent: ReturnType<typeof Address>) {
    return function call() {
        const instance = ({
            useMethod,
            useArgs,
            execute,
            result,
            _
        });

        let _method: string | undefined;
        let _args: any[] | undefined;
        let _result: Promise<any> | undefined;

        function useMethod(method: string) {
            _method = method;
            return instance;
        }

        function useArgs(...args: any[]) {
            _args = args ?? [];
            return instance;
        }

        function execute() {
            if (!_method) throw new Error("callFlow: missing method");
            if (!_args) throw new Error("callFlow: missing args");
            if (!parent._contract) throw new Error("callFlow: missing parent contract");
            _result = parent._contract.getFunction(_method)(_args);
            return instance;
        }

        function result() {
            return _result;
        }

        function _() {
            return parent;
        }

        return instance;
    }
}

const contract = Address()
    .bindProvider()
        .useBrowser()
    .bindCaller()
        .useKey("")
        .bind()
    .bindContract()
        .useABI([])
        .useAddress("")
        .bind()
    ?.contract()
        ?.on("", function() {
            
        })
            .then(function() {

            })