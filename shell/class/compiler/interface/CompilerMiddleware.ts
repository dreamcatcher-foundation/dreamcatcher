import {CompiledContractMaterial} from "./CompiledContractMaterial.ts";
import {CompilerPayload} from "./CompilerPayload.ts";

export type CompilerMiddleware = (payload: CompilerPayload) => CompiledContractMaterial;