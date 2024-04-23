

export function Maybe<ValueIfSuccessful>(hook: () => ValueIfSuccessful, onSuccessHook: (value: ValueIfSuccessful) => void, onFailHook: (error: unknown) => void) {
    try {
        onSuccessHook(hook());
    }
    catch {
        onFailHook(hook())
    }
}



export type Maybe<ValueIfSuccessful> = {
    success: true;
    value: ValueIfSuccessful;
} | {
    success: false;
    reason?: string;
    error?: unknown;
};

export function wrap<ValueIfSuccessful>(hook: () => ValueIfSuccessful): Maybe<ValueIfSuccessful> {
    let result: Maybe<ValueIfSuccessful>;
    try {
        result = {success: true, value: hook()};
    }
    catch (error: unknown) {
        const isError: boolean = error instanceof Error;
        if (isError) {
            const errorAsError: Error = error as Error;
            const reason: string = errorAsError.message;
            result = {success: false, reason: reason, error: error};
        }
        else {
            result = {success: false};
        }
    }
    return result;
}

export function expect(statement: boolean, reason?: string): boolean {
    if (!statement) {
        throw new Error(reason);
    }
    return true;
}