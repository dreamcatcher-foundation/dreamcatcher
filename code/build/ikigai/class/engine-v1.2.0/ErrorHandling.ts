import {sleep} from "./Misc.ts";

export type MayFail<Value> = ({
    success: true;
    value: Value
} | {
    success: false;
    reason?: string;
    error?: Error | unknown;
});

export function wrap<Result>(callback: () => Result): MayFail<Result> {
    let result: MayFail<Result>;

    try {
        result = ({success: true, value: callback()});
    }

    catch (error: unknown) {
        const errorIsInstanceOfError: boolean = error instanceof Error;
        let reason: string = "";
        
        if (errorIsInstanceOfError) {
            const errorAsError: Error = error as Error;
            result = ({success: false, reason: errorAsError.message, error: errorAsError});
        }

        else {
            result = ({success: false, reason: reason, error: error});
        }
    }

    return result;
}

export type IRetryArgs<Result> = ({
    code: () => Result;
    wait?: bigint;
    minAttempts?: bigint;
    maxAttempts?: bigint;
    onFinalAttempt?: Function;
    onFirstAttempt?: Function;
    onSuccess?: Function;
    isVerbose?: boolean;});
export async function retry<Result>(args: IRetryArgs<Result>): Promise<MayFail<Result>> {
    const {code, wait, minAttempts, maxAttempts, onFinalAttempt, onFirstAttempt, onSuccess, isVerbose} = args;
    const minAttemptsNum: number = Number(minAttempts);
    const maxAttemptsNum: number = Number(maxAttempts);
    let currentAttempt: number = 0;
    let result: MayFail<Result>;

    while (true) {
        let currentResult: MayFail<Result> = wrap<Result>(() => code());
        let currentResultIsASuccess: boolean = currentResult.success;
        
        if (currentResultIsASuccess) {
            const isAboveMinAttempts: boolean = currentAttempt >= minAttemptsNum;
            const hasSuccessCallback: boolean = !!onSuccess;

            if (isAboveMinAttempts && hasSuccessCallback) {
                onSuccess!();
            }

            if (isAboveMinAttempts) {
                result = currentResult;
                break;
            }
        }

        const hasFirstAttemptCallback: boolean = !!onFirstAttempt;
        const hasFinalAttemptCallback: boolean = !!onFinalAttempt;
        const isFirstAttempt: boolean = currentAttempt == 1;
        const isFinalAttempt: boolean = currentAttempt == maxAttemptsNum + 1;

        if (isVerbose) {
            console.log(`FailedAttempt: ${currentAttempt} retrying...`);
        }

        if (isFirstAttempt && hasFirstAttemptCallback) {
            onFirstAttempt!();
        }

        if (isFinalAttempt && hasFinalAttemptCallback) {
            onFinalAttempt!();
        }

        if (isFinalAttempt) {
            result = currentResult;
            break;
        }

        await sleep(wait ?? 0n);
    }

    return result;
}

export function expect(statement: boolean, reason?: string): true {

    if (!statement) {
        throw new Error(reason);
    }

    return true;
}