import {busySleep} from "./TimerLib.ts";

export type Maybe<ValueIfSuccessful> = {
    success: true;
    value: ValueIfSuccessful;
} | {
    success: false;
    reason?: string;
    error?: unknown;
};

export function wrap<ValueIfSuccessful>(callback: () => ValueIfSuccessful): Maybe<ValueIfSuccessful> {
    let result: Maybe<ValueIfSuccessful>;

    try {
        result = ({success: true, value: callback()});
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