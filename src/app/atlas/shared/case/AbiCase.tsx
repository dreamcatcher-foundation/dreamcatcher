import { Url } from "../web/Url.ts";

class AbiAdaptor {
    public constructor(
        private readonly _state: {
            inner: object[] | string[] | Url
        }
    ) {}

    public async resolve(): Promise<object[] | string[]> {
        if (this._state.inner instanceof Url) {
            return (await this._state.inner.response()).unwrap().data;
        }
        return this._state.inner;
    }
}