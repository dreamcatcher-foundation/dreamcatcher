import {Hook} from "./_Hook.ts";

export type QueueableHook<QueueableItem> = ReturnType<typeof QueueableHook<QueueableItem>>;

export function QueueableHook<QueueableItem>({
    _tag,
    _message,
    _once}: {
        _tag: string;
        _message?: string;
        _once?: boolean;}) {
    let _queue: QueueableItem[] = [];
    let _hook: Hook<QueueableItem, void> = Hook({
        _tag: _tag,
        _message: _message,
        _once: _once,
        _hook: (item?: QueueableItem) => !!item && _queue.push(item)
    });
    let _instance = {
        remove,
        consume
    };

    function remove(): void {
        _hook.remove();
    }

    function consume(): QueueableItem | undefined {
        return _queue.shift();
    }

    return _instance;
}