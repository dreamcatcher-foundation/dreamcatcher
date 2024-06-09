import { EventEmitter as FbEventEmitter } from "fbemitter";
import { EventSubscription as FbEventSubscription } from "fbemitter";
import * as TsResult from "ts-results";

interface IEventBus {

}

const eventBus = (function() {
    const _questionEventEmitters: Map<string, undefined | FbEventEmitter> = new Map();
    const _responseEventEmitters: Map<string, undefined | FbEventEmitter> = new Map();
    let _instance: IEventBus;

    async function dispatchMessage<Result>({ to="global", message="", timeout=0n, item=undefined }: { to?: string; message?: string; timeout?: bigint; item?: unknown; }): Promise<TsResult.Option<Result>> {
        return new Promise(function(resolve): void {
            let success: boolean = false;
            const subscription: FbEventSubscription = _responseEventEmitterOf({ node: to }).once(message, function(response): void {
                if (!success) {
                    success = true;
                    resolve(response);
                    return;
                }
                return;
            });
            _questionEventEmitterOf({ node: to }).emit(message, item);
            setTimeout(function() {
                if (!success) {
                    subscription.remove();
                    resolve(TsResult.None);
                    return;
                }
                return;
            }, Number(timeout));
            return;
        });
    }

    function dispatchEvent({ from="global", event="", item=undefined }: { from?: string; event?: string; item?: unknown; }): void {
        return _questionEventEmitterOf({ node: from }).emit(event, item);
    }

    function _questionEventEmitterOf({ node }: { node: string; }): FbEventEmitter {
        if (!_questionEventEmitters.get(node)) {
            return _questionEventEmitters
                .set(node, new FbEventEmitter())
                .get(node)!;
        }
        return _questionEventEmitters.get(node)!;
    }

    function _responseEventEmitterOf({ node }: { node: string; }): FbEventEmitter {
        if (!_responseEventEmitters.get(node)) {
            return _responseEventEmitters
                .set(node, new FbEventEmitter())
                .get(node)!;
        }
        return _responseEventEmitters.get(node)!;
    }

    return function() {
        if (!_instance) {
            return _instance = { dispatchMessage, dispatchEvent };
        }
        return _instance;
    }
})();


export class EventBuss {
    private constructor() {}
    protected static _innerQuestionEventEmitters: Map<string, undefined | FbEventEmitter> = new Map();
    protected static _innerResponseEventEmitters: Map<string, undefined | FbEventEmitter> = new Map();

    public static questionEventEmitterOf({ node }: { node: string; }): FbEventEmitter {
        if (!this._innerQuestionEventEmitters.get(node)) {
            return this._innerQuestionEventEmitters
                .set(node, new FbEventEmitter())
                .get(node)!;
        }
        return this._innerQuestionEventEmitters.get(node)!;
    }

    public static responseEventEmitterOf({ node }: { node: string; }): FbEventEmitter {
        if (!this._innerResponseEventEmitters.get(node)) {
            return this._innerResponseEventEmitters
                .set(node, new FbEventEmitter())
                .get(node)!;
        }
        return this._innerResponseEventEmitters.get(node)!;
    }

    public static dispatchMessage({ to="public", message="", timeout=0n, item }: { to?: string; message?: string; timeout?: bigint; item?: unknown; }) {
        return new Promise(resolve => {
            let success: boolean = false;
            const subscription: FbEventSubscription = this.responseEventEmitterOf({ node: to }).once(message, response => {
                if (!success) {
                    success = true;
                    resolve(response);
                    return;
                }
                return;
            });
            this.questionEventEmitterOf({ node: to }).emit(message, item);
            setTimeout(() => {

            });
        });
    }
}