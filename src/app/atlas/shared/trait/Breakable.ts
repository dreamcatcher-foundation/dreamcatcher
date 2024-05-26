class Breakable {
    public constructor(private _isBroken: boolean = true) {}

    public isBroken(): boolean {
        return this._isBroken;
    }
}

export { Breakable };