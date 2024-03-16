export class CompiledContractMaterial {
    public constructor(
        public readonly ABI: unknown,
        public readonly bytecode: unknown,
        public readonly selectors: unknown,
        public readonly messages:
            | object
            | "no errors or warnings"
    ) {}
}