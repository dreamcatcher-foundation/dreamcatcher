import ContractGateway from "./ContractGateway.ts";

export default class EnvVarContractGateway extends ContractGateway {
    public constructor(address: string, abi: object[], envKeyRpcUrl: string) {
        const rpcUrl: string | undefined = process.env?.[envKeyRpcUrl];
        if (!rpcUrl) {
            throw new Error("EnvVarContractGateway: missing rpc url");
        }
        super(address, abi, rpcUrl);
    }
}