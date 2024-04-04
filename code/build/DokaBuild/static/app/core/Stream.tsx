import {EventEmitter} from "fbemitter";
import {type CSSProperties} from "react";

export namespace stream {
    export const network = (function() {
        let self: EventEmitter;
        return function() {
            return self = self ?? new EventEmitter();
        }
    })();

    // DOM
    export function renderSpring({name, spring}: {name: string, spring: object}) {
        post({event: `${name} render spring`, data: spring});
    }

    export function renderStyle({name, style}: {name: string, style: CSSProperties}) {
        post({event: `${name} render style`, data: style});
    }

    // Remote Getter & Setter
    export async function get({name, property}: {name: string, property: string}) {
        const requestEvent = `${name} get ${property}`;
        const receiveEvent = `${name} ${property}`;
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

    export async function set({name, property, data}: {name: string, property: string, data?: any}) {
        post({event: `${name} set ${property}`, data: data});
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