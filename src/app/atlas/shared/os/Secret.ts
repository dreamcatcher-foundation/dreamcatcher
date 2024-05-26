import { Option } from "ts-results";
import { Some } from "ts-results";
import { None } from "ts-results";

class Secret {
    public constructor(private _evk: string) {}

    public evk(): string {
        return this._evk;
    }

    public fetch(): Option<string> {
        let content: string | undefined = process
            ?.env
            ?.[this.evk()];
        if (!content) {
            return None;
        }
        return new Some<string>(content);
    }
}

export { Secret };