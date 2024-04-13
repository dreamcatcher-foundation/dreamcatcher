import type {CSSProperties} from "react";
import {EventEmitter, EventSubscription} from "fbemitter";

export type IStream = (EventEmitter);

let _reqStream: IStream = new EventEmitter();
let _resStream: IStream = new EventEmitter();

export type IOnArgs = ({
    message: string;
    handler: (...args: any[]) => any;
} & {
    once?: boolean;
} & ({
    recipient?: string;
    sender?: never;
} | {
    recipient?: never;
    sender?: string
}));

export function on(args: IOnArgs) {
    let {message, handler, once, sender, recipient} = args;

    if (sender) {
        message = `${sender}|${message}`;
    }

    if (recipient) {
        message = `${recipient}|${message}`;
    }

    if (once) {
        return _oneTimeListener(message, handler);
    }
        
    return _listener(message, handler);
}

function _oneTimeListener(message: string, handler: (...args: any[]) => any) {
    return _reqStream.once(message, _reciever(message, handler));
}

function _listener(message: string, handler: (...args: any[]) => any) {
    return _reqStream.addListener(message, _reciever(message, handler));
}

function _reciever(message: string, handler: (...args: any[]) => any) {
    return function(data?: any) {
        let response: any = handler(data);

        _resStream.emit(message, response);
    }
}

export type IPostArgs = ({
    message: string;
    data?: any;
} & ({
    sender?: string;
    recipient?: never;
} | {
    sender?: never;
    recipient?: string;
}));

export async function post<Response>(args: IPostArgs): Promise<Response> {
    let {message, data, sender, recipient} = args;

    if (sender) {
        message = `${sender}|${message}`;
    }

    if (recipient) {
        message = `${recipient}|${message}`;
    }

    return new Promise(function(resolve) {
        _resStream.once(message, function(response: Response) {
            resolve(response);
        });

        _reqStream.emit(message, data);
    });
}

export type IRenderArgs = ({
    recipient: string;
    className?: string;
    spring?: object;
    style?: CSSProperties;
    text?: string;
    state?: bigint;
});

export async function render(args: IRenderArgs) {
    const {recipient, className, spring, style, text, state} = args;
    const responses: unknown[] = [];

    if (className) {
        responses.push(
            await post({
                recipient: recipient,
                message: "RenderClassNameRequest",
                data: className
            })
        );
    }

    if (spring) {
        responses.push(
            await post({
                message: "RenderSpringRequest",
                recipient: recipient,
                data: spring
            })
        );
    }

    if (style) {
        responses.push(
            await post({
                message: "RenderStyleRequest",
                recipient: recipient,
                data: style
            })
        );
    }

    if (state) {
        responses.push(
            await post({
                message: "RenderStateRequest",
                recipient: recipient,
                data: state
            })
        );
    }

    if (text) {
        responses.push(
            await post({
                message: "RenderTextRequest",
                recipient: recipient,
                data: text
            })
        );
    }

    return responses;
}

export type IPushArgs = ({
    recipient: string;
    component: React.ReactNode;
});

export async function push(args: IPushArgs) {
    let {recipient, component} = args;

    return await post({
        message: "PushRequest",
        recipient: recipient,
        data: component
    });
}

export async function swap(args: IPushArgs) {
    let {recipient, component} = args;

    pull({recipient: recipient});

    setTimeout(function() {
        push({
            recipient: recipient,
            component: component
        });

        return;
    }, 0);

    return;
}

export type IPullArgs = ({
    recipient: string;
});

export async function pull(args: IPullArgs) {
    let {recipient} = args;

    return await post({
        message: "PullRequest",
        recipient: recipient
    });
}

export async function wipe(args: IPullArgs) {
    let {recipient} = args;

    return await post({
        message: "WipeRequest",
        recipient: recipient
    });
}

export function cleanup(subs: EventSubscription[]) {
    const subsLength: number = subs.length;

    for (let i = 0; i < subsLength; i++) {
        const sub: EventSubscription = subs[i];

        sub.remove();
    }

    return;
}

export {EventSubscription};