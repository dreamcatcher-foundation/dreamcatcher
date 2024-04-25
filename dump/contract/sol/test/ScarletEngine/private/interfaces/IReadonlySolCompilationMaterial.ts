// SPDX-License-Identifier: UNLICENSED
import {type IOk} from "./IOk.ts";

export interface IReadonlySolCompilationMaterial extends IOk {
    abi: Readonly<object[]>;
    bytecode: string;
    warnings: Readonly<object[]>;
    errors: Readonly<object[]>;
}