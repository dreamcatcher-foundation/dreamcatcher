import {EventEmitter} from "fbemitter";
import {type CSSProperties} from "react";

export namespace stream {
    export const network = (function() {
        let self: EventEmitter;
        return function() {
            return self = self ?? new EventEmitter();
        }
    })();

    // RemoteDOM
    export function pushBelow({tag, item}: {tag: string, item: JSX.Element}) {
        post({event: `${tag} pushBelow`, data: item});
    }

    export function pushAboveLastItem({tag, item}: {tag: string, item: JSX.Element}) {
        post({event: `${tag} pushAboveLastItem`, data: item});
    }

    export function pushAbove({tag, item}: {tag: string, item: JSX.Element}) {
        post({event: `${tag} pushAbove`, data: item});
    }

    export function pushBetween({tag, item}: {tag: string, item: JSX.Element}) {
        post({event: `${tag} pushBetween`, data: item});
    }

    export function swapBelow({tag}: {tag: string}) {
        /// -> Swaps the last component in a 'RemoteContainer' for 
        ///    another.
        
    }

    export function pullBelow({tag}: {tag: string}) {
        post({event: `${tag} pullBelow`});
    }

    export function pullAbove({tag, item}: {tag: string, item: JSX.Element}) {
        post({event: `${tag} pullAbove`, data: item});
    }

    export function pull({tag, position}: {tag: string, position: number}) {
        post({event: `${tag} pull`, data: position});
    }    

    // DOM
    export function renderSpring({tag, spring}: {tag: string, spring: object}) {
        post({event: `${tag} render spring`, data: spring});
    }

    export function renderStyle({tag, style}: {tag: string, style: CSSProperties}) {
        post({event: `${tag} render style`, data: style});
    }

    // Remote Getter & Setter
    export async function get({tag, property}: {tag: string, property: string}) {
        const requestEvent = `${tag} get ${property}`;
        const receiveEvent = `${tag} ${property}`;
        return new Promise(function(resolve) {
            once({
                event: receiveEvent,
                task: function(data?: unknown) {
                    resolve(data);
                }
            });
            post({event: requestEvent});
        });
    }

    export async function set({tag, property, data}: {tag: string, property: string, data?: any}) {
        post({event: `${tag} set ${property}`, data: data});
    }

    // Common Use
    export function subscribe({event, task, context}: {event: string, task: Function, context?: any}) {
        return network().addListener(event, task, context);
    }

    export function once({event, task, context}: {event: string, task: Function, context?: any}) {
        return network().once(event, task, context);
    }

    export function wipe({event}: {event: string}) {
        return network().removeAllListeners(event);
    }

    export function post({event, data}: {event: string, data?: any}) {
        return network().emit(event, data);
    }
}