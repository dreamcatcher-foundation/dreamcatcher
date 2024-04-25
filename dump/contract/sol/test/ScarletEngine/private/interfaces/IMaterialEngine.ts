// SPDX-License-Identifier: UNLICENSED
import {IReadonlySolCompilationMaterial} from "./IReadonlySolCompilationMaterial.ts";

export interface IMaterialEngine {
    material: Readonly<{[contractName: string]: IReadonlySolCompilationMaterial | undefined}>;
}