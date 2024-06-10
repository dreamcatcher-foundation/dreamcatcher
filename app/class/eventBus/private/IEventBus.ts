import { type EventEmitter as IFbEventEmitter } from "fbemitter";

export interface IEventBus {
    questionEventEmitterOf(node: string): IFbEventEmitter;
    responseEventEmitterOf(node: string): IFbEventEmitter;
}