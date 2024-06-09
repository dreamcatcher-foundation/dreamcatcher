import axios, {type AxiosResponse} from "axios";
import {BrowserProvider, Contract, ContractFactory, Network} from "ethers";

async function response(url: string): Promise<any> {
    return (await axios.get(url)).data;
}

import {type SupportedChainIds} from "../../../interface/SupportedChainIds.ts";

export const client = (function() {
    const couldNotFindMetamaskMessage: string = "couldNotFindMetamask";
    const unsupportedChainIdMessage: string = "unsupportedChainId";

    async function isSupportedChainId(provider: BrowserProvider): Promise<boolean> {
        const network: Network = await provider.getNetwork();
        const chainId: bigint = network.chainId;
        const isSupportedChainId: boolean = (await supportedChainIds()).includes(chainId);
        return isSupportedChainId;
    }

    function metamask(): any {
        const windowAsAny: any = window as any;
        const metamask: any = windowAsAny.ethereum;
        return metamask;
    }

    async function abstractBinaryInterfaceOf(contractCatalogId: string): Promise<object[]> {
        return response(`/abstractBinaryInterface/${contractCatalogId}`);
    }

    async function bytecodeOf(contractCatalogId: string): Promise<string> {
        return response(`bytecode/${contractCatalogId}`);
    }

    async function invoke(address: string, contractCatalogId: string, method: string, ...args: any[]): Promise<any> {
        if (!metamask()) return couldNotFindMetamaskMessage;
        const provider: BrowserProvider = new BrowserProvider(metamask());
        if (!await isSupportedChainId(provider)) return unsupportedChainIdMessage;
        const contractAbstractBinaryInterface: object[] = await abstractBinaryInterfaceOf(contractCatalogId);
        const contract: Contract = new Contract(address, contractAbstractBinaryInterface, provider);
        const response: any = await contract.getFunction(method)(...args);
        return response;
    }

    async function deploy(contractCatalogId: string, ...args: any[]): Promise<any> {
        if (!metamask()) return couldNotFindMetamaskMessage;
        const provider: BrowserProvider = new BrowserProvider(metamask());
        if (!await isSupportedChainId(provider)) return unsupportedChainIdMessage;
        const contractAbstractBinaryInterface: object[] = await abstractBinaryInterfaceOf(contractCatalogId);
        const contractBytecode: string = await bytecodeOf(contractCatalogId);
        const factory: ContractFactory = new ContractFactory(contractAbstractBinaryInterface, contractBytecode, provider);
        const contract = await factory.deploy(...args);
        return contract;
    }

    async function supportedChainIds(): Promise<SupportedChainIds> {
        return response("/supportedChainIds");
    }

    return {isSupportedChainId, metamask, abstractBinaryInterfaceOf, bytecodeOf, invoke, deploy, supportedChainIds};
})();