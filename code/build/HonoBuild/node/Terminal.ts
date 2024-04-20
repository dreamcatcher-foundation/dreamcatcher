import {EventEmitter, EventSubscription} from "fbemitter";

export type MayFail<Value> = ({
    success: true;
    value: Value;
} | {
    success: false;
    reason?: string;
    error?: Error | unknown;
});

export function expect(statement: boolean, reason?: string): true {

    if (!statement) {
        throw new Error(reason);
    }

    return true;
}

export async function sleep(ms: bigint): Promise<undefined> {

    return new Promise(resolve => setTimeout(resolve, Number(ms)));
}

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
    let finalResult: MayFail<Result>;

    while (attempt <= numMaxAttempts) {
        const result: MayFail<Result> = wrap<Result>(() => code());
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

const _requestEmitter: EventEmitter = new EventEmitter();
const _resolveEmitter: EventEmitter = new EventEmitter();

export function post<Item, Response>({
    node,
    message,
    item,
    timeout}: {
        node: string;
        message: string;
        item?: Item;
        timeout?: bigint;}): Promise<Response | null> {
    const signature: string = `${message} | ${node}`;

    return new Promise(function(resolve, reject) {
        let success: boolean = false;

        _resolveEmitter.once(signature, function(response?: Response) {
            success = true;
            resolve(response ?? null);
        });

        _requestEmitter.emit(signature, item);
        setTimeout(() => !success && reject(undefined), Number(timeout ?? 1000n));
    });
}

export type Hook = ReturnType<typeof Hook>;

export function Hook<Item, Response>({
    _node,
    _message,
    _handler,
    _once}: {
        _node: string;
        _message: string;
        _handler: (item?: Item) => Response;
        _once?: boolean;}) {
    let _signature: string = `${_message} | ${_node}`;
    let _subscription: EventSubscription;

    function instance() {
        return ({
            remove
        });
    }

    if (_once) {
        _subscription = _requestEmitter.once(_signature, function(item: Item) {
            const response: Response = _handler(item);
            _resolveEmitter!.emit(_signature, response);
        });
    }

    _subscription = _requestEmitter.addListener(_signature, function(item: Item) {
        const response: Response = _handler(item);
        _resolveEmitter!.emit(_signature, response);
    });

    function remove() {
        _subscription.remove();
        return instance();
    }

    return instance();
}

export function QueueableHook<QueueableItem>({
    _node,
    _message,
    _once}: {
        _node: string;
        _message: string;
        _once?: boolean;}) {
    const _queue: QueueableItem[] = [];
    const _hook: Hook = Hook({
        _node: _node,
        _message: _message,
        _once: _once,
        _handler: (item?: QueueableItem) => !!item && _queue.push(item)
    });

    function instance() {
        return ({
            remove,
            consume
        });
    }

    function remove() {
        _hook.remove();
        return instance();
    }

    function consume() {
        return _queue.shift();
    }

    return instance();
}

export function bootTerminal() {}

export {EventEmitter, EventSubscription};