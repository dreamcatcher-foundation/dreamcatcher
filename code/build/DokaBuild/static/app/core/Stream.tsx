import {EventEmitter} from "fbemitter";
import {type CSSProperties} from "react";
import type { SpringProps } from "react-spring";
export namespace stream {
    export const network = (function() {
        let self: EventEmitter;
        return function() {
            return self = self ?? new EventEmitter();
        }
    })();
    /// -> Remote DOM
    export function pushBelow({tag, item}: {tag: string; item: JSX.Element;}) {
        return post({event: `${tag} pushBelow`, data: item});
    }
    export function pullBelow({tag}: {tag: string;}) {
        return post({event: `${tag} pullBelow`});
    }
    export function swapBelow({tag, item}: {tag: string; item: JSX.Element;}) {
        pullBelow({tag: tag});
        return setTimeout(() => pushBelow({tag: tag, item: item}), 0);
    }
    export function pushAbove({tag, item}: {tag: string; item: JSX.Element;}) {
        return post({event: `${tag} pushAbove`, data: item});
    }
    export function pullAbove({tag}: {tag: string;}) {
        return post({event: `${tag} pullAbove`});
    }
    export function swapAbove({tag, item}: {tag: string; item: JSX.Element;}) {
        pullAbove({tag: tag});
        return setTimeout(() => pushAbove({tag: tag, item: item}), 0);
    }
    export function wipeContainer({tag}: {tag: string;}) {
        post({event: `${tag} wipe`});
    }
    /// -> DOM
    export function renderSpring({tag, spring}: {tag: string; spring: SpringProps;}) {
        return post({event: `${tag} render spring`, data: spring});
    }
    export function renderStyle({tag, style}: {tag: string; style: CSSProperties;}) {
        return post({event: `${tag} render style`, data: style});
    }
    /// -> Getter & Setter
    export async function get({tag, property}: {tag: string; property: string;}) {
        const requestEvent = `${tag} get ${property}`;
        const receiveEvent = `${tag} ${property}`;
        return new Promise(function(resolve) {
            function handleReceiveEvent(data?: unknown) {
                resolve(data);
            }
            once({event: receiveEvent, task: handleReceiveEvent});
            post({event: requestEvent});
        });
    }
    /// -> Common Use
    export function subscribe({event, task, context}: {event: string; task: Function; context?: any}) {
        return network().addListener(event, task, context);
    }
    export function once({event, task, context}: {event: string; task: Function; context?: any}) {
        return network().once(event, task, context);
    }
    export function wipe({event}: {event: string;}) {
        return network().removeAllListeners(event);
    }
    export function post({event, data}: {event: string; data?: any}) {
        return network().emit(event, data);
    }
}