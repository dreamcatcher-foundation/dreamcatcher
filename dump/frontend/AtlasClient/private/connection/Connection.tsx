import {EventEmitter} from "fbemitter";

export function on(network: EventEmitter, event: string, listener: Function, context?: any) {
    return network.addListener(event, listener, context);
}

export function broadcast(network: EventEmitter, event: string, ...data: any[]) {
    network.emit(event, ...data);
    return;
}