import * as TsResult from "ts-results";

export function secret({ key }: { key: string; }): TsResult.Option<string> {
    const content: string | undefined = process?.env?.[key];
    if (!content) {
        return TsResult.None;
    }
    return TsResult.Some<string>(content);
}