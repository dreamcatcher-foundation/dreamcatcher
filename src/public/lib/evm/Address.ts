

function assert(condition: boolean, reason?: string): void {
    
}


class Address {
    public constructor(private readonly _string: string) {
        assert(this._string.length === 42);
        assert(this._string.startsWith("0x"));
    }

    public toString(): string {
        return this._string;
    }
}

