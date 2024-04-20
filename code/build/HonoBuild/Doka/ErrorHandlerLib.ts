import {busySleep} from "./TimerLib.ts";

export type Maybe<ValueIfSuccessful> = ({
    success: true;
    value: ValueIfSuccessful;
} | {
    success: false;
    reason?: string;
    error?: unknown;
});

export function wrap<ValueIfSuccessful>(hook: () => ValueIfSuccessful): Maybe<ValueIfSuccessful> {
    let result: Maybe<ValueIfSuccessful>;
    try {
        result = ({success: true, value: hook()});
    }
    catch (error: unknown) {
        const isError: boolean = error instanceof Error;
        if (isError) {
            const errorAsError: Error = error as Error;
            const reason: string = errorAsError.message;
            result = ({success: false, reason: reason, error: error});
        }
        else {
            result = ({success: false});
        }
    }
    return result;
}

export type RetryArgs<ValueIfSuccessful> = {
    hook: () => ValueIfSuccessful;
    sleepDuration?: bigint;
    minAttempts?: bigint;
    maxAttempts?: bigint;
    onEachAttemptHook?: Function;
    onFinalAttemptHook?: Function;
    onFirstAttemptHook?: Function;
    onSuccessHook?: Function;
    onFailureHook?: Function;
};

export function retry<ValueIfSuccessful>(args: RetryArgs<ValueIfSuccessful>) {
    const {
        hook,
        sleepDuration,
        minAttempts,
        maxAttempts,
        onEachAttemptHook,
        onFinalAttemptHook,
        onFirstAttemptHook,
        onSuccessHook,
        onFailureHook
    } = args;
    const minAttemptsNum: number = Number(minAttempts);
    const maxAttemptsNum: number = Number(maxAttempts);
    let currentAttempt: number = 0;
    let finalResult: Maybe<ValueIfSuccessful>;
    while(currentAttempt <= maxAttemptsNum) {
        const result: Maybe<ValueIfSuccessful> = wrap<ValueIfSuccessful>(() => hook());
        const resultIsSuccess: boolean = result.success;
        if (resultIsSuccess) {
            const isAboveMinAttempts: boolean = currentAttempt >= minAttemptsNum;
            const hasSuccessHook: boolean = !!onSuccessHook;
            if (isAboveMinAttempts && hasSuccessHook) {
                onSuccessHook!();
            }
            if (isAboveMinAttempts) {
                finalResult = result;
                break;
            }
        }
        const hasRepeatedHook: boolean = !!onEachAttemptHook;
        const hasFailureHook: boolean = !!onFailureHook;
        const hasFirstAttemptHook: boolean = !!onFirstAttemptHook;
        const hasFinalAttemptHook: boolean = !!onFinalAttemptHook;
        const isFirstAttempt: boolean = currentAttempt == 0;
        const isFinalAttempt: boolean = currentAttempt == maxAttemptsNum;
        if (isFirstAttempt && hasFirstAttemptHook) {
            onFirstAttemptHook!();
        }
        if (isFinalAttempt && hasFinalAttemptHook) {
            onFinalAttemptHook!();
        }
        if (isFinalAttempt && hasFailureHook) {
            onFailureHook!();
        }
        if (hasRepeatedHook) {
            onEachAttemptHook!();
        }
        if (isFinalAttempt) {
            finalResult = result;
            break;
        }
        busySleep(sleepDuration ?? 0n);
        currentAttempt += 1;
    }
    return finalResult!;
}

export function expect(statement: boolean, reason?: string): boolean {
    if (!statement) {
        throw new Error(reason);
    }
    return true;
}