import { type EventEmitter as IFbEventEmitter } from "fbemitter";

export interface IEventBus {
    questionEventEmitterOf({ node }: { node: string; }): IFbEventEmitter;
    responseEventEmitterOf({ node }: { node: string; }): IFbEventEmitter;
}