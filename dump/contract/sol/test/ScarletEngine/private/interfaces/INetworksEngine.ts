// SPDX-License-Identifier: UNLICENSED
import {JsonRpcProvider, Wallet} from "ethers";

export interface INetworksEngine {
    networks: Readonly<{[networkName: string]: JsonRpcProvider | undefined}>;
    accounts: Readonly<{[networkName: string]: Wallet | undefined}>;
}