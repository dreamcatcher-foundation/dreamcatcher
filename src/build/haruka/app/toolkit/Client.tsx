import type { ContractMethod } from "./Bundle.ts";
import { BrowserProvider } from "./Bundle.ts";
import { Contract } from "./Bundle.ts";
import { Network } from "./Bundle.ts";

interface IClient {
    node():BrowserProvider;
    network():Promise<Network>;
    chainId():Promise<bigint>;
    contractGateway(
        address?:string,
        abstractContractInterface?:object[]|string[]
    ):Contract;
    methodGateway(
        address?:string,
        abstractContractInterface?:object[]|string[],
        methodName?:string
    ):ContractMethod;
    callMethodGateway(
        address?:string,
        abstractContractInterface?:object[]|string[],
        methodName?:string,
        ...args:any[]
    ):Promise<any>;
}

const client = (function() {
    let self: IClient;

    function node(): BrowserProvider {
        return new BrowserProvider((window as any).ethereum);
    }

    async function network() {
        return await node().getNetwork();
    }

    async function chainId(): Promise<bigint> {
        if (!hasMetamaskExtension()) {}
        return (await network()).chainId;
    }
 
    function contractGateway(address:string="0x0000000000000000000000000000000000000000", abstractContractInterface:object[]|string[]=[]): Contract {
        return new Contract(address, abstractContractInterface, node());
    }

    function methodGateway(address:string="0x0000000000000000000000000000000000000000", abstractContractInterface:object[]|string[]=[], methodName:string) {
        return contractGateway(address, abstractContractInterface).getFunction(methodName);
    }

    async function callMethodGateway(
        address:string="0x0000000000000000000000000000000000000000", 
        abstractContractInterface:object[]|string[]=[],
        methodName:string,
        ...args:any[]): Promise<any> {
        return await methodGateway(
            address,
            abstractContractInterface,
            methodName
        )(...args);
    }

    function hasMetamaskExtension() {
        return !!(window as any).ethereum;
    }

    return function() {
        if (!self) {
            return self = {
                node,
                network,
                chainId,
                contractGateway,
                methodGateway,
                callMethodGateway
            };
        }
        return self;

    }
})();


client().callMethodGateway("", [], "");