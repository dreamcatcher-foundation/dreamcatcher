import type IOk from "./IOk.ts";

export default interface ISolCompilationMaterial extends IOk {
    ABI: object[];
    bytecode: string;
    warnings: object[];
    errors: object[];
}