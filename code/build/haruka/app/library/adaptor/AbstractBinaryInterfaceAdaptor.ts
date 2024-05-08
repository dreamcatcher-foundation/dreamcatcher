import SolidityPath from "../os/path/SolidityPath.ts";
import JavaScriptObjectNotationPath from "../os/path/JavaScriptObjectNotationPath.ts";

export class AbstractBinaryInterface {
    public constructor(
        private readonly _abstractBinaryInterfaceLike:
            | object[]
            | string[]
            | string
            | SolidityPath
            | JavaScriptObjectNotationPath
    ) {}

    public get():
        | object[]
        | string[] {

        if (Array.isArray(this._abstractBinaryInterfaceLike)) {
            return this._abstractBinaryInterfaceLike;
        }
        else if (typeof this._abstractBinaryInterfaceLike === "string") {
            return [this._abstractBinaryInterfaceLike];
        }
        else if (this._abstractBinaryInterfaceLike instanceof SolidityPath) {
            return this._abstractBinaryInterfaceLike.abstractBinaryInterface();
        }
        else if (this._abstractBinaryInterfaceLike instanceof JavaScriptObjectNotationPath) {
            return this._abstractBinaryInterfaceLike.load() as 
                | object[] 
                | string[];
        }
        else {
            return [] as string[];
        }
    }
}


let x: AbstractBinaryInterface = new AbstractBinaryInterface([]);
x.get();