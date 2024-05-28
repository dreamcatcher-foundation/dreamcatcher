import * as FbEmitter from "fbemitter";

class _Stream {
    private constructor() {}
    
    private static _eventEmitterMap0: Map<string, FbEmitter.EventEmitter | undefined> = new Map();
    private static _eventEmitterMap1: Map<string, FbEmitter.EventEmitter | undefined> = new Map();

    public static async dispatch(toNodeId: string, command: string, timeout: bigint, item: unknown = undefined): Promise<unknown> {
        return new Promise(resolve => {
            let success: boolean = false;
            let subscription: FbEmitter.EventSubscription = this._eventEmitter1(toNodeId).once(command, (response: unknown) => {
                if (!success) {
                    success = true;
                    resolve(response);
                    return;
                }
                return;
            });
            this._eventEmitter0(toNodeId).emit(command, item);
            setTimeout(() => {
                if (!success) {
                    subscription.remove();
                    resolve(undefined);
                }
            }, Number(timeout));
            return;
        });
    }

    public static dispatchEvent(fromNodeId: string, event: string, item: unknown = undefined): void {
        return this._eventEmitter0(fromNodeId).emit(event, item);
    }

    public static createSubscription(atNodeId: string, command: string, hook: (item?: unknown) => unknown, once: boolean = false): FbEmitter.EventSubscription {
        if (once) {
            return this._eventEmitter0(atNodeId).once(command, (item?: unknown) => this._eventEmitter1(atNodeId).emit(command, hook(item)));
        }
        return this._eventEmitter0(atNodeId).addListener(command, (item?: unknown) => this._eventEmitter1(atNodeId).emit(command, hook(item)));
    }

    public static createEventSubscription(fromNodeId: string, event: string, hook: (item?: unknown) => void, once: boolean = false): FbEmitter.EventSubscription {
        if (once) {
            return this._eventEmitter0(fromNodeId).once(event, hook);
        }
        return this._eventEmitter0(fromNodeId).addListener(event, hook);
    }

    private static _eventEmitter0(nodeId: string): FbEmitter.EventEmitter {
        if (!this._eventEmitterMap0.get(nodeId)) {
            return this._eventEmitterMap0
                .set(nodeId, new FbEmitter.EventEmitter())
                .get(nodeId)!;
        }
        return this._eventEmitterMap0.get(nodeId)!;
    }

    private static _eventEmitter1(nodeId: string): FbEmitter.EventEmitter {
        if (!this._eventEmitterMap1.get(nodeId)) {
            return this._eventEmitterMap1
                .set(nodeId, new FbEmitter.EventEmitter())
                .get(nodeId)!;
        }
        return this._eventEmitterMap1.get(nodeId)!;
    }
}

class Streamer {
    private _nodeId: string;

    public constructor(nodeId: string) {
        this._nodeId = nodeId;
    }

    public nodeId(): string {
        return this._nodeId;
    }

    public dispatch(toNodeId: string, command: string, timeout: bigint, item: unknown = undefined): Promise<unknown> {
        return _Stream.dispatch(toNodeId, command, timeout, item);
    }

    public dispatchEvent(event: string, item: unknown = undefined): void {
        return _Stream.dispatchEvent(this.nodeId(), event, item);
    }

    public createSubscription(command: string, hook: (item?: unknown) => unknown, once: boolean = false): FbEmitter.EventSubscription {
        return _Stream.createSubscription(this.nodeId(), command, hook, once);
    }

    public createEventSubscription(fromNodeId: string, event: string, hook: (item?: unknown) => void, once: boolean = false): FbEmitter.EventSubscription {
        return _Stream.createEventSubscription(fromNodeId, event, hook, once);
    }
}

export { Streamer };