class Pointer<Value> {
    public constructor(
        protected _value: Value
    ) {}

    
}




class Result<Instance, Value> {
    public constructor(
        protected _root: Instance,
        protected _value: Value
    ) {}

    match(against: Value, callback: (value: Value) => void): this {
        if (against === this._value) {
            callback(this._value);
        }
        return this;
    }

    resolve(): Instance {
        return this._root;
    }
}

function x(): Result<typeof x, "Steve" | "George"> {
    return new Result(x, "George");
}

x()
    .match("Steve", function(value) {
        value = "Steve";
    })
    .resolve()


type Resul2t<Instance, Result> = {
    match: (against: Result, callback: (result: Result) => void) => Result;
    resolved: () => Instance;
}

function ResultConstructor<Instance, Result>(root: Instance, result: Result) {
    let instance: Result;

    return function() {

        function match(against: Result, callback: (result: Result) => void): Result {
            if (against === result) {
                callback(result);
            }
            return instance;
        }

        function resolved(): Instance {
            return root;
        }

        return instance = {
            match,
            resolved
        };
    }();
}


const bob
    .doSomething()
        .match()
        .match()
        .match()
            .setReason()
            .close()
        .close()
    .doSomethingElse()