// SPDX-License-Identifier: UNLICENSED
import {type IReadonlySolCompilationMaterial} from "./IReadonlySolCompilationMaterial.ts";

export interface ISolCompiler {
    cache: Readonly<{[contractName: string]: IReadonlySolCompilationMaterial | undefined}>;
    compileAndCache: (contractName: string, contractPath: string, fSrcDir: string) => boolean;
}