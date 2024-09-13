import type {DecodedError} from "ethers-decode-error";
import {Interface} from "ethers";
import {ErrorDecoder} from "ethers-decode-error";


function encode(signature: string, ... data: unknown[]) {
    let name: string = signature
        .split(" ")[1]
        .split("(")[0];
    let abstractBinaryInterface: Interface = new Interface([signature]);
    return abstractBinaryInterface.encodeFunctionData(name, data);
}


let x = encode("function previewMint(uint256) external view returns (uint256)", 500n);
console.log(x);


async function decode(fn: Function) {
    try {
        await fn();
    }
    catch (e: unknown) {
        let decoder: ErrorDecoder = ErrorDecoder.create();
        let decodedError: DecodedError = await decoder.decode(e);
        
    }

}