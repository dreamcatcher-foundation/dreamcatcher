import * as TsResult from "ts-results";

export function matchArray<Item>(array0: Item[], array1: Item[]): TsResult.Result<boolean, "CannotMatchUnequalArrayLength"> {
    if (array0.length !== array1.length) {
        return TsResult.Err("CannotMatchUnequalArrayLength");
    }
    for (let i = 0; i < array0.length; i++) {
        if (array0[i] !== array1[i]) {
            return TsResult.Ok<boolean>(false);
        }
    }
    return TsResult.Ok<boolean>(true);
}