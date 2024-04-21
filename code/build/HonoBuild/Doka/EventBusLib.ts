import {EventEmitter, EventSubscription} from "fbemitter";

const emitter0_: EventEmitter = new EventEmitter();
const emitter1_: EventEmitter = new EventEmitter();

export type PostArgs<Item> = {
    tag: string;
    message: string;
    item?: Item;
    timeout?: bigint;
};

export function post<Item, Response>(args: PostArgs<Item>): Promise<Response | null> {
    const {tag, message, item, timeout} = args;
    let signature: string = "";
    signature += tag;
    signature += "|";
    signature += message;
    return new Promise(function(resolve, reject) {
        let success: boolean = false;
        emitter1_.once(signature, function(response?: Response) {
            success = true;
            resolve(response ?? null);
        });
        emitter0_.emit(signature, item);
        setTimeout(() => !success && reject(undefined), Number(timeout ?? 1000n));
    });
}

export type BaseHookArgs = {
    tag: string;
    message: string;
    once?: boolean;
};

export type HookArgs<Item, Response> = {
    hook: (item?: Item) => Response;
} & BaseHookArgs;

export type Hook = ReturnType<typeof Hook>;

export function Hook<Item, Response>(args_: HookArgs<Item, Response>) {
    let sub_: EventSubscription;
    let signature_: string = "";
    signature_ += args_.tag;
    signature_ += "|";
    signature_ += args_.message;
    const instance_ = {
        remove
    };

    (function() {
        if (args_.once) {
            sub_ = emitter0_.once(signature_, function(item: Item) {
                const response_: Response = args_.hook(item);
                emitter1_.emit(signature_, response_);
            });
        }
        sub_ = emitter0_.addListener(signature_, function(item: Item) {
            const response_: Response = args_.hook(item);
            emitter1_.emit(signature_, response_);
        });
    })();

    function remove(): void {
        sub_.remove();
    }

    return instance_;
}

export type QueueableHook = ReturnType<typeof QueueableHook>;

export function QueueableHook<QueueableItem>(args_: BaseHookArgs) {
    const queue_: QueueableItem[] = [];
    const hook_: Hook = Hook<QueueableItem, void>({
        tag: args_.tag,
        message: args_.message,
        once: args_.once,
        hook: (item?: QueueableItem) => !!item && queue_.push(item)
    });
    const instance_ = {
        remove,
        consume
    }

    function remove(): void {
        return hook_.remove();
    }

    function consume(): QueueableItem | undefined {
        return queue_.shift();
    }

    return instance_;
}

export type ValueHookHook<Value> = (value?: {oldValue: Value; newValue: Value}) => void;

export type ValueHookArgs<Value> = {
    tag: string;
    initialValue: Value;
    hooks?: ValueHookHook<Value>[];
};

export type ValueHook<Value> = ReturnType<typeof ValueHook<Value>>;

export function ValueHook<Value>(tag_: string, initialValue_: Value) {
    const lastValue_: Value[] = [initialValue_];
    const instance_ = {
        tag,
        get,
        set,
        onChange
    };

    function tag(): string {
        return tag_;
    }

    function get(): Value {
        /**
         * -> There is always at least one value which is the initial value
         *    which means that this function can never return undefined.
         */
        return structuredClone(lastValue_.at(-1)!);
    }

    function set(value: Value) {
        const oldValue: Value = get();
        const newValue: Value = value;
        lastValue_.push(value);
        post({
            tag: tag_,
            message: "ValueHookChange",
            item: {
                oldValue: oldValue,
                newValue: newValue,
            }
        });
    }

    function onChange(hook: ValueHookHook<Value>, once?: boolean): Hook {
        return Hook({
            tag: tag_,
            message: "ValueHookChange",
            once: once,
            hook: function(value?: {oldValue: Value; newValue: Value}) {
                return hook(value);
            }
        });
    }

    return instance_;
}

export {EventEmitter, EventSubscription};