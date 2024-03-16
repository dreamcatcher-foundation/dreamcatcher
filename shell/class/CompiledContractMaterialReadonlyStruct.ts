export class CompiledContractMaterialReadonlyStruct {
    public constructor(
        public readonly ABI: unknown,
        public readonly bytecode: unknown,
        public readonly selectors: unknown,
        public readonly errorsAndWarnings: 
            | object 
            | "no errors or warnings"
    ) {}
}