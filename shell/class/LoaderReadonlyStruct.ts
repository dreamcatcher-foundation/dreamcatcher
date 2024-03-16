import { NetworkReadonlyStruct } from "./NetworkReadonlyStruct.ts";

export class LoaderReadonlyStruct {
    public constructor(
        public readonly srcDir: string,
        public readonly fsrcDir: string,
        public readonly contractNames: string[],
        public readonly networks: NetworkReadonlyStruct[]
    ) {}
}