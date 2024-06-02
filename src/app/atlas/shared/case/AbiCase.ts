import { SolFile } from "../os/SolFile.ts";
import { Url } from "../web/Url.ts";

class AbiCase {
    public constructor(
        private _state: {
            inner:
                | object[]
                | string[]
                | string
                | SolFile
                | Url;
        }
    ) {}

    public async resolve():
        Promise<
            | object[]
            | string[]
        > {
        if (Array.isArray(this._state.inner)) {
            return this._state.inner;
        }
        if (typeof this._state.inner === "string") {
            return [this._state.inner];
        }
        if (this._state.inner instanceof SolFile) {
            return this._state.inner.abi().unwrap();
        }
        if (this._state.inner instanceof Url) {
            return JSON.parse(((await this._state.inner.response()).unwrap().data)) as object[] | string[];
        }
        else {
            return [] as object[];
        }
    }
}

export { AbiCase };