import type {Maybe} from "../type/error/maybe/Maybe.ts";
import {sleep} from "./TimerLib.ts";

export function expect(statement: boolean, reason?: string): void {
    if (!statement) throw new Error(reason ?? "");
}

export function wrap<Result>(callback: () => Result): Maybe<Result> {
    let result: Maybe<Result>;

    try {
        result = ({success: true, value: callback()});
    }

    catch (error: unknown) {
        let isError: boolean = error instanceof Error;
        let reason: string = "";

        if (isError) {
            let errorError: Error = error as Error;
            let errorMessage: string = errorError.message;
            result = ({success: false, reason: errorMessage, error: errorError});
        }

        else {
            result = ({success: false, reason: reason});
        }
    }

    return result;
}

export async function retry<Result>({
    code,
    wait,
    minAttempts,
    maxAttempts,
    onEachAttempt,
    onFinalAttempt,
    onFirstAttempt,
    onSuccess,
    onFailure,
    verbose}: {
        code: () => Result;
        wait?: bigint;
        minAttempts?: bigint;
        maxAttempts?: bigint;
        onEachAttempt?: Function;
        onFinalAttempt?: Function;
        onFirstAttempt?: Function;
        onSuccess?: Function;
        onFailure?: Function;
        verbose?: boolean}) {
    const numMinAttempts: number = Number(minAttempts);
    const numMaxAttempts: number = Number(maxAttempts);
    let attempt: number = 0;
    let finalResult: Maybe<Result>;

    while (attempt <= numMaxAttempts) {
        const result: Maybe<Result> = wrap<Result>(() => code());
        const resultIsOk: boolean = result.success;

        if (resultIsOk) {
            const isAboveMinAttempts: boolean = attempt >= numMinAttempts;
            const hasSuccessCallback: boolean = !!onSuccess;

            if (isAboveMinAttempts && hasSuccessCallback) onSuccess!();

            if (isAboveMinAttempts) {
                finalResult = result;
                break;
            }
        }

        const hasCallbackOnEachAttempt: boolean = !!onEachAttempt!();
        const hasFailureCallback: boolean = !!onFailure;
        const hasFirstAttemptCallback: boolean = !!onFirstAttempt;
        const hasFinalAttemptCallback: boolean = !!onFinalAttempt;
        const isFirstAttempt: boolean = attempt == 1;
        const isFinalAttempt: boolean = attempt == numMaxAttempts + 1;

        if (verbose) console.log(`FailedAttempt: ${attempt} retrying...`);
        if (isFirstAttempt && hasFirstAttemptCallback) onFirstAttempt!();
        if (isFinalAttempt && hasFinalAttemptCallback) onFinalAttempt!();
        if (isFinalAttempt && hasFailureCallback) onFailure!();

        if (isFinalAttempt) {
            finalResult = result;
            break;
        }

        if (hasCallbackOnEachAttempt) onEachAttempt!();
        await sleep(wait ?? 0n);
        attempt += 1;
    }

    return finalResult!;
}