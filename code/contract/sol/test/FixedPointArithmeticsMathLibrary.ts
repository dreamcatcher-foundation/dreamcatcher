// SPDX-License-Identifier: UNLICENSED
import {type IConfig, type IEngine, Engine} from "./ScarletEngine/ScarletEngine.ts";

const config: IConfig = {
    contracts: [{
        name: "TestableFixedPointArithmeticsMathLibrary",
        path: "code/contract/sol/native/utils/math/TestableFixedPointArithmeticsMathLibrary.sol"
    }],
    fSrcDir: "code/contract/sol/dist",
    networks: [{
        name: "polygonTenderlyFork",
        rpcUrl: process.env.polygonTenderlyForkRpcUrl!,
        privateKey: process.env.polygonPrivateKey!
    }]
}

const engine: IEngine = new Engine(config);

async function main() {
    const networkId = "polygonTenderlyFork";
    const contractName = "TestableFixedPointArithmeticsMathLibrary";
    const contract: any = await engine.deployContract(networkId, contractName);
    const maximumRepresentableEntireValue = await contract.maximumRepresentableEntireValue(18n);
    const uint256Max = await contract.uint256Max();
    const netAssetValue = await contract.netAssetValue([
        2000n * (10n ** 18n),
        4500n * (10n ** 18n),
        1000n * (10n ** 18n)
    ], [
        2n * (10n ** 18n),
        4n * (10n ** 18n),
        9n * (10n ** 18n)
    ]);
    const netAssetValuePerShare = await contract.netAssetValuePerShare([
        2000n * (10n ** 18n),
        4000n * (10n ** 18n),
        5000n * (10n ** 18n)
    ], [
        2n * (10n ** 18n),
        4n * (10n ** 18n),
        1n * (10n ** 18n)
    ], 37500n * (10n ** 18n));
    const amountToMint = await contract.amountToMint(
        2000n * (10n ** 18n),
        4500n * (10n ** 18n),
        9000n * (10n ** 18n)
    );
    const amountToSend = await contract.amountToSend(
        2000n * (10n ** 18n),
        4500n * (10n ** 18n),
        3990n * (10n ** 18n)   
    );
    const scale = await contract.scale(
        3505n * (10n ** 18n),
        3666n * (10n ** 18n)
    );
    const slice = await contract.slice(
        1000n * (10n ** 18n),
        5000n
    );
    const sum = await contract.sum([
        1000n * (10n ** 18n),
        3985n * (10n ** 18n)
    ]);
    const max = await contract.max([
        1000n * (10n ** 18n),
        3985n * (10n ** 18n)
    ]);
    const min = await contract.min([
        1000n * (10n ** 18n),
        3985n * (10n ** 18n)
    ]);
    const avg = await contract.avg([
        1000n * (10n ** 18n),
        3985n * (10n ** 18n)
    ]);
    const asNewR = await contract.asNewR(
        1000n * (10n ** 18n),
        18n,
        2n
    );
    const asN = await contract.asN(
        1000n * (10n ** 18n),
        2n
    );
    const asR = await contract.asR(
        1000n * (10n ** 2n),
        18n
    );
    console.log({
        maximumRepresentableEntireValue: maximumRepresentableEntireValue,
        uint256Max: uint256Max,
        netAssetValue: netAssetValue,
        netAssetValuePerShare: netAssetValuePerShare,
        amountToMint: amountToMint,
        amountToSend: amountToSend,
        scale: scale,
        slice: slice,
        sum: sum,
        max: max,
        min: min,
        avg: avg,
        add: null,
        sub: null,
        mul: null,
        div: null,
        exp: null,
        asNewR: asNewR,
        asN: asN,
        asR: asR
    });
}

main();