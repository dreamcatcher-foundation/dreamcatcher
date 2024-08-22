

class Quote {

    protected static _toHrv(bigint: bigint): number {
        return Number(bigint) / 10**18;
    }

    private _best: bigint;
    private _real: bigint;
    private _slippage: bigint;
    
    public constructor({
        best,
        real,
        slippage
    }:{
        best: bigint;
        real: bigint;
        slippage: bigint;
    }) {
        this._best = best;
        this._real = real;
        this._slippage = slippage;
    }

    public best(): bigint {
        return this._best;
    }

    public real(): bigint {
        return this._real;
    }

    public slippage(): bigint {
        return this._slippage;
    }

    public bestToHrv(): number {
        return Quote._toHrv(this._best);
    }

    public realToHrv(): number {
        return Quote._toHrv(this._real);
    }

    public slippageToHrv(): number {
        return Quote._toHrv(this._slippage);
    }
}

const quote = new Quote({
    best: 0n,
    real: 0n,
    slippage: 2n
});


