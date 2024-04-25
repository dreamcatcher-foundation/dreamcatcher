// SPDX-License-Identifier: UNLICENSED
import {type IReadonlySolCompilationMaterial} from "./interfaces/IReadonlySolCompilationMaterial";

export class ReadonlySolCompilationMaterial implements IReadonlySolCompilationMaterial {
    public constructor(
        protected abi_: object[] = [],
        protected bytecode_: string = "",
        protected warnings_: object[] = [],
        protected errors_: object[] = [],
        protected ok_: boolean = false
    ) {}

    public get abi(): readonly object[] {
        return this.abi_;
    }

    public get bytecode(): string {
        return this.bytecode_;
    }

    public get warnings(): readonly object[] {
        return this.warnings_;
    }

    public get errors(): readonly object[] {
        return this.errors_;
    }

    public get ok(): boolean {
        return this.ok_;
    }

    public markSafe(): boolean {
        this.ok_ = true;
        return true;
    }

    public markUnsafe(): boolean {
        this.ok_ = false;
        return true;
    }
}