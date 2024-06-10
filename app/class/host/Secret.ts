import * as TsResult from "ts-results";

export function secret(k: string): TsResult.Option<string> {
    const content: string | undefined = process?.env?.[k];
    if (!content) {
        return TsResult.None;
    }
    return TsResult.Some<string>(content);
}