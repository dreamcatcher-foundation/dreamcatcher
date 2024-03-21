// SPDX-License-Identifier: UNLICENSED

export interface IConfig {
    contracts: Readonly<({
        name: string;
        path: string;
    })[]>;
    fSrcDir: string;
    networks: ({
        name: string;
        rpcUrl: string;
        privateKey: string;
    })[];
}