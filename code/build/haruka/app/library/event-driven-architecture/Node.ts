import {type EventSubscription, stream} from "../Library.ts";

const _registeredNodeKeys: string[] = [];

interface Node {
    override: () => Node;
    register: (nodeKey?: string) => Node;
    def: (methodKey: string) => Node;
    define: (methodKey: string) => Node;
    cmd: (hook: (self: Node, ...items: any[]) => any, methodKey?: string) => Node;
    command: (hook: (self: Node, ...items: any[]) => any, methodKey?: string) => Node;
    on: (hook: (self: Node, ...items: any[]) => any, eventKey: string, fromNodeKey: string) => Node;
    post: (eventKey: string, ...items: any[]) => Node;
    call: (toNodeKey: string, methodKey: string, timeout?: bigint, ...items: any[]) => Promise<any>;
    unmount: () => Node;
}

/**
 * Represents a node in a distributed system or application.
 * Nodes can register event handlers, command handlers, and
 * communicate with each other through events and method calls.
 * This class provides methods for managing node registration,
 * event handling, command execution, and cleanup.
 */
function Node(): Node {
    const instance = {
        override,
        register,
        def,
        cmd,
        define,
        command,
        on,
        post,
        call,
        unmount
    };
    let _nodeKey: string = "";
    let _subscriptions: EventSubscription[] = [];
    let _temporaryMethodKey: string | undefined;
    let _temporaryOverrideFlag: boolean = false;

    function nodeKey(): string {
        return _nodeKey;
    }

    /**
     * NOTE This method sets a flag indicating that the node 
     *      registration process should override any existing 
     *      node with the same key. It allows redefining a node 
     *      with the same key across different scopes or files. 
     *      This method should be called before registering a 
     *      node.
     */
    function override() {
        _temporaryOverrideFlag = true;
        return instance;
    }

    /**
     * NOTE Registers a node with a unique key. If nodeKey is not 
     *      provided, a unique key is generated automatically. 
     *      If nodeKey is provided and it's already registered, 
     *      an error is thrown unless the override flag is set. 
     *      If the override flag is set, the existing node with 
     *      the same key will be replaced.
     */
    function register(nodeKey?: string): Node {
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
            _temporaryOverrideFlag = false;
            return instance;
        }
        if (_registeredNodeKeys.includes(nodeKey) && !_temporaryOverrideFlag) {
            throw new Error("NODE_ID_IS_ALREADY_REGISTERED");
        }
        _registeredNodeKeys.push(nodeKey);
        _nodeKey = nodeKey;
        _temporaryOverrideFlag = false;
        return instance;
    }

    /**
     * NOTE Sets the method key for the next command or command handler. 
     *      This method should be called before cmd or command 
     *      to define the method key. It provides a cleaner way 
     *      to define method keys separate from the command 
     *      registration process.
     */
    function def(methodKey: string): Node {
        _temporaryMethodKey = methodKey;
        return instance;
    }

    /**
     * NOTE An alias for the def method. It serves the same 
     *      purpose as def, allowing you to define the method 
     *      key before using it in cmd or command.
     */
    function define(methodKey: string): Node {
        return def(methodKey);
    }

    /**
     * NOTE Registers a command handler for the node. It takes a hook 
     *      function as a parameter, which will be executed when 
     *      the command is triggered. If methodKey is not 
     *      provided, it uses the last defined method key. If no 
     *      method key is defined, an error is thrown. The hook 
     *      function receives the node instance (self) and any 
     *      additional parameters passed when the command is 
     *      executed.
     */
    function cmd(hook: (self: Node, ...items: any[]) => any, methodKey?: string): Node {
        if (!methodKey && !_temporaryMethodKey) {
            throw new Error("METHOD_KEY_NOT_DEFINED");
        }
        const subscription: EventSubscription = stream().hook(nodeKey(), methodKey ?? _temporaryMethodKey ?? "", function(...items: any[]) {
            hook(instance, ...items);
        });
        _subscriptions.push(subscription);
        _temporaryMethodKey = undefined;
        return instance;
    }

    /**
     * NOTE An alias for the cmd method. It serves the same 
     *      purpose as cmd, providing an alternative name for 
     *      registering command handlers.
     */
    function command(hook: (self: Node, ...items: any[]) => any, methodKey?: string): Node {
        return cmd(hook, methodKey);
    }

    /**
     * NOTE Sets up an event listener for the node. It takes a hook 
     *      function as a parameter, which will be executed 
     *      when the specified event occurs. The eventKey 
     *      parameter specifies the event to listen for, and the 
     *      fromNodeKey parameter specifies the node from which 
     *      the event originates. The hook function receives 
     *      the node instance (self) and any additional parameters 
     *      passed when the event is triggered.
     */
    function on(hook: (self: Node, ...items: any[]) => any, eventKey: string, fromNodeKey: string): Node {
        const subscription: EventSubscription = stream().on(fromNodeKey, eventKey, hook);
        _subscriptions.push(subscription);
        return instance;
    }

    /**
     * NOTE Posts an event from the current node to another node. 
     *      It emits the specified event with optional data 
     *      items to the target node, allowing inter-node 
     *      communication.
     */
    function post(eventKey: string, ...items: any[]): Node {
        stream().post(nodeKey(), eventKey, ...items);
        return instance;
    }

    /**
     * NOTE Invokes a method on another node and waits for a response. 
     *      It sends a method call with optional parameters 
     *      to the specified node and returns a Promise that 
     *      resolves with the response from the target node. 
     *      An optional timeout can be provided to limit the 
     *      waiting time for a response.
     */
    async function call(toNodeKey: string, methodKey: string, timeout?: bigint, ...items: any[]): Promise<any> {
        return await stream().call(toNodeKey, methodKey, timeout, ...items);
    }
    
    /**
     * NOTE Cleans up event listeners associated with the node. 
     *      It removes all event subscriptions, effectively 
     *      unmounting the node and freeing up resources. 
     *      This method is useful for cleaning up event listeners 
     *      when a node is no longer needed, such as during 
     *      component unmounting in a React application.
     */
    function unmount(): Node {
        _subscriptions.forEach(subscription => subscription.remove());
        return instance;
    }

    return instance;
}

export {Node};