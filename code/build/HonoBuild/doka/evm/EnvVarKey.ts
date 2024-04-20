import type {Maybe} from "../type/error/maybe/Maybe.ts";
import {wrap, expect} from "../util/ErrorHandlerLib.ts";
import {Wallet, Signer, JsonRpcProvider, Network, Contract, ContractFactory, BrowserProvider} from "ethers";

let _browserProvider: BrowserProvider | undefined = undefined;
let _rpcProvider: JsonRpcProvider | undefined = undefined;
let _network: Network | undefined = undefined;
let _signer: Signer | undefined = undefined;
let _chainId: bigint | undefined = undefined;

export function connectBrowserProvider(): Maybe<Promise<boolean>> {
    return wrap(async function() {
        const windowAsAny: any = window as any;
        const ethereum: any = windowAsAny.ethereum;
        const ethereumFound: boolean = !!ethereum;
        expect(ethereumFound, "metamask not installed");
        _browserProvider = new BrowserProvider(ethereum);
        _network = await _browserProvider.getNetwork();
        _signer = await _browserProvider.getSigner();
        _chainId = _network.chainId;
        return true;
    });
}

export function connectJsonRpcProvider(url: string): Maybe<boolean> {
    return wrap(function() {
        _rpcProvider = new JsonRpcProvider(url);
        return true;
    });
}


function _checkBrowserProviderConnection() {
    const windowAsAny: any = window as any;
    const ethereum: any = windowAsAny.ethereum;
    const ethereumNotFound: boolean = !ethereum;
    if (ethereumNotFound) return false;
    try
}

const result = connectBrowserProvider();

if (!result.success) {
    result.reason
}

export async function callWithBrowserProvider({
    address,
    ABI,
    method,
    args}: {
        address: string;
        ABI: object[];
        method: string;
        args?: unknown[];}) {
    
}






export type CallWithJsonRpcProviderRequest = ({
    address: string;
    ABI: object[];
    method: string;
    url: string;
    args: unknown[];
});

export async function callWithJsonRpcProvider(request: CallWithJsonRpcProviderRequest) {
    const {address, ABI, method, url, args} = request;
    const provider: JsonRpcProvider = new JsonRpcProvider(url);
    const contract: Contract = new Contract(address, ABI, provider);
    return await contract.getFunction(method)(args);
}

export type CallWithEnvVarJsonRpcProviderRequest = ({
    address: string;
    ABI: object[];
    method: string;
    envKeyUrl: string;
    args: unknown[];
});

export function callWithEnvVarJsonRpcProvider(request: CallWithEnvVarJsonRpcProviderRequest): Maybe<Promise<unknown>> {
    const {address, ABI, method, envKeyUrl, args} = request;
    return wrap(async function() {
        const url: string | undefined = process.env?.[envKeyUrl];
        const urlFound: boolean = !!url;
        expect(urlFound, "missing key");
        return await callWithJsonRpcProvider({
            address: address,
            ABI: ABI,
            method: method,
            args: args,
            url: url!
        });
    });
}

export type CallWithJsonRpcProviderAndKeyRequest = ({
    address: string;
    ABI: object[];
    method: string;
    url: string;
    key: string;
    args: unknown[];
});

export async function callWithJsonRpcProviderAndKey(request: CallWithJsonRpcProviderAndKeyRequest) {
    const {address, ABI, method, url, key, args} = request;
    const provider: JsonRpcProvider = new JsonRpcProvider(url);
    const signer: Wallet = new Wallet(key, provider);
    const contract: Contract = new Contract(address, ABI, signer);
    return await contract.getFunction(method)(args);
}

export type CallWithMetamaskRequest = ({
    address: string;
    ABI: object[];
    method: string;
    args?: unknown[];
});

export async function callWithMetamaskAccount(request: CallWithMetamaskRequest) {
    const {address, ABI, method, args} = request;
    const ethereum: any = (window as any).ethereum;
    const provider: BrowserProvider = new BrowserProvider(ethereum);
    const contract: Contract = new Contract(address, ABI, provider);
    return await contract.getFunction(method)(args);
}

export type Args = ({
    ABI: object[];
    bytecode: string;
});

export async function deployWithMetamaskAccount({
    ABI,
    bytecode,
    args = []}: {
        ABI: object[];
        bytecode: string;
        args?: unknown[]}) {
    const ethereum: any = (window as any).ethereum;
    const provider: BrowserProvider = new BrowserProvider(ethereum);
    const builder: ContractFactory = new ContractFactory(ABI, bytecode, provider);
    const newlyDeployedContract =  await builder.deploy(args);
    return newlyDeployedContract;
}


export async function deployAndCallWithMetamaskAccount() {

}

deployWithMetamaskAccount({
    ABI: [],
    bytecode: ""
});


export async function newlyDeployedContract() {}

export async function deployWithSigner({
    ABI,
    bytecode,
    url,
    key,
    args}: {
        ABI: object[];
        bytecode: string;
        url: string;
        key: string;
        args?: unknown[]}) {
    const provider: JsonRpcProvider = new JsonRpcProvider(url);
    const signer: Wallet = new Wallet(key, provider);
    const builder: ContractFactory
}