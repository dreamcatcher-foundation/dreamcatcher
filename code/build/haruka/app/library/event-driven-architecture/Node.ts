import {type EventSubscription, stream} from "../Library.ts";

const _registeredNodeKeys: string[] = [];

interface Node {
    register: (nodeKey?: string) => Node;
    cmd: (hook: (self: Node, ...items: any[]) => any, methodKey?: string) => Node;
    command: (hook: (self: Node, ...items: any[]) => any, methodKey?: string) => Node;
    on: (hook: (self: Node, ...items: any[]) => any, eventKey: string, fromNodeKey: string) => Node;
    post: (eventKey: string, ...items: any[]) => Node;
    call: (toNodeKey: string, methodKey: string, timeout?: bigint, ...items: any[]) => Promise<any>;
    unmount: () => Node;
}

function Node(): Node {
    const instance = {
        register,
        cmd,
        command,
        on,
        post,
        call,
        unmount
    };
    let _nodeKey: string = "";
    let _subscriptions: EventSubscription[] = [];

    function nodeKey(): string {
        return _nodeKey;
    }

    function register(nodeKey?: string, override?: boolean): Node {
        if (!nodeKey) {
            let isUniqueKey: boolean = false;
            let iteration: bigint = 0n;
            let result: string = "";
            while(!isUniqueKey) {
                const uniqueNodeKey: string = "" + iteration;
                if (!_registeredNodeKeys.includes(uniqueNodeKey)) {
                    _registeredNodeKeys.push(uniqueNodeKey);
                    result = uniqueNodeKey;
                    isUniqueKey = true;
                    break;
                }
                iteration += 1n;
            }
            _nodeKey = result;
            return instance;
        }
        if (_registeredNodeKeys.includes(nodeKey) && !override) {
            throw new Error("NODE_ID_IS_ALREADY_REGISTERED");
        }
        _registeredNodeKeys.push(nodeKey);
        _nodeKey = nodeKey;
        return instance;
    }

    function cmd(hook: (self: Node, ...items: any[]) => any, methodKey?: string): Node {
        const subscription: EventSubscription = stream().hook(nodeKey(), methodKey ?? "", function(...items: any[]) {
            hook(instance, ...items);
        });
        _subscriptions.push(subscription);
        return instance;
    }

    function command(hook: (self: Node, ...items: any[]) => any, methodKey?: string): Node {
        return cmd(hook, methodKey);
    }

    function on(hook: (self: Node, ...items: any[]) => any, eventKey: string, fromNodeKey: string): Node {
        const subscription: EventSubscription = stream().on(fromNodeKey, eventKey, hook);
        _subscriptions.push(subscription);
        return instance;
    }

    function post(eventKey: string, ...items: any[]): Node {
        stream().post(nodeKey(), eventKey, ...items);
        return instance;
    }

    async function call(toNodeKey: string, methodKey: string, timeout?: bigint, ...items: any[]): Promise<any> {
        return await stream().call(toNodeKey, methodKey, timeout, ...items);
    }
    
    function unmount(): Node {
        _subscriptions.forEach(subscription => subscription.remove());
        return instance;
    }

    return instance;
}

export {Node};