import {EventEmitter, EventSubscription} from "fbemitter";

const requestEmitterRef_: EventEmitter = new EventEmitter();
const resolveEmitterRef_: EventEmitter = new EventEmitter();

export interface PostArgs<Item> {
    node: string;
    message: string;
    item?: Item;
    timeout?: bigint;
}

export function post<Item, Response>(args: PostArgs<Item>): Promise<Response | null> {
    const {node, message, item, timeout} = args;
    const signature: string = message + "|" + node;

    return new Promise(function(resolve, reject) {
        let success: boolean = false;

        resolveEmitterRef_.once(signature, function(response?: Response) {
            success = true;
            resolve(response ?? null);
        });

        requestEmitterRef_.emit(signature, item);
        setTimeout(() => !success && reject(undefined), Number(timeout ?? 1000n));
    });
}

export interface HookArgs<Item, Response> {
    node: string;
    message: string;
    handler: (item?: Item) => Response;
    once?: boolean;
}

export function Hook<Item, Response>(args: HookArgs<Item, Response>) {
    const {node, message, handler, once} = args;
    const _signature: string = message + "|" + node;
    let _subscription: EventSubscription;
    const instance = ({
        remove
    });

    if (once) {
        _subscription = requestEmitterRef_!.once(_signature, function(item: Item) {
            const response: Response = handler(item);
            resolveEmitterRef_!.emit(_signature, response);
        });
    }

    _subscription = requestEmitterRef_!.addListener(_signature, function(item: Item) {
        const response: Response = handler(item);
        resolveEmitterRef_!.emit(_signature, response);
    });

    function remove() {
        _subscription.remove();
        return instance;
    }

    return instance;
}

export type IQueueableHookArgs = ({
    node: string;
    message: string;
    once?: boolean;
    request?: EventEmitter;
    resolve?: EventEmitter;});
export function QueueableHook<QueueableItem>(args: IQueueableHookArgs) {
    const {node, message, once, request, resolve} = args;
    const _queue: QueueableItem[] = [];
    const _hook: ReturnType<typeof Hook> = Hook({
        node: node,
        message: message,
        once: once,
        request: request,
        resolve: resolve,
        handler: (item?: QueueableItem) => !!item && _queue.push(item)
    });
    const instance = ({
        remove,
        consume
    });

    function remove() {
        _hook.remove();
        return instance;
    }

    function consume() {
        return _queue.shift();
    }

    return instance;
}