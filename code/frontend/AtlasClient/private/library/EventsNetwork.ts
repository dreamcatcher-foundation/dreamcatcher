import {EventEmitter, EventSubscription} from "fbemitter";
export function on(internalNetwork: EventEmitter, eventType: string, listener: Function, context?: any): EventSubscription {
  return internalNetwork.addListener(eventType, listener, context);
}
export function broadcast(internalNetwork: EventEmitter, eventType: string, ...data: any[]): void {
  return internalNetwork.emit(eventType, ...data);
}