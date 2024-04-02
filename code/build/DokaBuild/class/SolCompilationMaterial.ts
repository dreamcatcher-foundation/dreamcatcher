import type ISolCompilationMaterial from "../interface/ISolCompilationMaterial.ts";

export default class SolCompilationMaterial implements ISolCompilationMaterial {
    declare private _ABI: object[];
    declare private _bytecode: string;
    declare private _warnings: object[];
    declare private _errors: object[];
    declare private _ok: boolean;

    public constructor() {}

    public get ABI() {
        return this._ABI;
    }

    public get bytecode() {
        return this._bytecode;
    }

    public get warnings() {
        return this._warnings;
    }

    public get errors() {
        return this._errors;
    }

    public set ABI(ABI: object[]) {
        this._ABI = ABI;
    }

    public set bytecode(bytecode: string) {
        this._bytecode = bytecode;
    }

    public set warnings(warnings: object[]) {
        this._warnings = warnings;
    }

    public set errors(errors: object[]) {
        this._errors = errors;
    }

    public get ok() {
        return this._ok;
    }

    public markSafe() {
        this._ok = true;
        return true;
    }

    public markUnsafe() {
        this._ok = false;
        return true;
    }
}