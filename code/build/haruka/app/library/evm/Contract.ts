import {JsonRpcProvider, Contract} from "ethers";
import Secret from "../os/Secret";
import {AbstractBinaryInterface} from "../adaptor/AbstractBinaryInterfaceAdaptor";

async function query({...payload}: {
    contract: {
        address: string;
        abstractBinaryInterface: AbstractBinaryInterface;
        method: string;
        args?: any[];
    },
    nodeUrl: string;
}) {
    let node: JsonRpcProvider = new JsonRpcProvider(payload.nodeUrl);
    let contract: Contract = new Contract(payload.contract.address, payload.contract.abstractBinaryInterface.get(), node);
    return await contract.getFunction(payload.contract.method)(...payload.contract.args ?? []);
}

async function queryEvents({...payload}: {
    contract: {
        address: string;
        abstractBinaryInterface:
        | object[]
        | string[];
        eventSignature: string;
    },
    nodeUrl: string;
}) {

}

query({
    contract: {
        address: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
        abstractBinaryInterface: [
            "function WETH() external view returns (address)"
        ],
        method: "WETH"
    },
    nodeUrl: new Secret("polygonTestnetRpcUrl").get()
}).then(response => console.log(response));

