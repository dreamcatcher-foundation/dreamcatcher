

class Maybe<Value> {
    private _value: Value; 
    private _error: Error;

    public constructor(hook: () => Value) {
        try {
            this._value = hook();
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                this._error = error;
            }
        }
    }

    public value(): Value {
        return this._value;
    }

    public ok() {
        
    }

    public print() {
        for (let i = 0; i < this._error.length; i += 1) {
            console.error(this._error[i]);
        }
    }
}



function main() {

    throw new Error("xxx");
}

new Maybe(30 === 30, new Error());