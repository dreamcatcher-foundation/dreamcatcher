export class CompilerPayload {
    public constructor(
        public readonly srcDir: string,
        public readonly fsrcDir: string,
        public readonly contractNames: string[]
    ) {}
}