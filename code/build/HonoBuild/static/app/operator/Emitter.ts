import type {
    CSSProperties} from "react";
import {
    EventEmitter, 
    EventSubscription} from "fbemitter";

export const defaultReqEmitter:EventEmitter = new EventEmitter();
export const defaultResEmitter:EventEmitter = new EventEmitter();
export const defaultTimeout:bigint = 1000n;

export type Handler = ((data?:unknown) => unknown);

export type OnArgs = ({
    socket:string;
    message:string;
    handler:Handler;
    once?:boolean;
    reqEmitter?:EventEmitter;
    resEmitter?:EventEmitter;
});

export function on(args:OnArgs):EventSubscription {
    const {
        socket,
        message,
        handler,
        once,
        reqEmitter,
        resEmitter
    } = args;

    const signature:string = `${message}|${socket}`;
    const selectedReqEmitter:EventEmitter = reqEmitter ?? defaultReqEmitter;
    const selectedResEmitter:EventEmitter = resEmitter ?? defaultResEmitter;
    
    if (once) return selectedReqEmitter.once(signature, function(data?:unknown) {
        const response:unknown = handler(data);

        selectedResEmitter.emit(signature, response);
    })

    return selectedReqEmitter.addListener(signature, function(data?:unknown) {
        const response:unknown = handler(data);

        selectedResEmitter.emit(signature, response);
    });
}

export type PostArgs = ({
    socket:string;
    message:string;
    data?:unknown;
    timeout?:bigint;
    reqEmitter?:EventEmitter;
    resEmitter?:EventEmitter;
});

export async function post(args:PostArgs):Promise<unknown> {
    const {
        socket,
        message,
        data,
        timeout,
        reqEmitter,
        resEmitter
    } = args;

    const signature:string = `${message}|${socket}`;
    const selectedReqEmitter:EventEmitter = reqEmitter ?? defaultReqEmitter;
    const selectedResEmitter:EventEmitter = resEmitter ?? defaultResEmitter;
    
    return new Promise(function(resolve, reject) {
        let success:boolean = false;

        selectedResEmitter.once(signature, (response?:unknown) => resolve(response));
        selectedReqEmitter.emit(signature, data);

        setTimeout(function() {
            if (!success) reject(null);
        }, Number(timeout ?? defaultTimeout));
    });
}

export type RenderArgs = ({
    socket:string;
    timeout?:bigint;
    reqEmitter?:EventEmitter;
    resEmitter?:EventEmitter;
    className?:string;
    spring?:object;
    style?:CSSProperties;
    text?:string;
});

export function render(args:RenderArgs):(Promise<unknown>)[] {
    const {
        socket,
        timeout,
        reqEmitter,
        resEmitter,
        className,
        spring,
        style,
        text
    } = args;

    const sharedPostArgs = ({
        socket: socket,
        reqEmitter: reqEmitter,
        resEmitter: resEmitter,
        timeout: timeout
    }) as const;

    const responses:(Promise<unknown>)[] = [];

    if (className) responses.push(post({
        ...sharedPostArgs,
        message: "RenderClassNameRequest",
        data: className
    }));

    if (spring) responses.push(post({
        ...sharedPostArgs,
        message: "RenderSpringRequest",
        data: spring
    }));

    if (style) responses.push(post({
        ...sharedPostArgs,
        message: "RenderStyleRequest",
        data: style
    }));

    if (text) responses.push(post({
        ...sharedPostArgs,
        message: "RenderTextRequest",
        data: text
    }));

    return responses;
}

export type PushArgs = ({
    socket:string;
    item:React.ReactNode;
});

export async function push(args:PushArgs):Promise<unknown> {
    const {
        socket, 
        item
    } = args;

    return post({
        socket: socket,
        message: "PushRequest",
        data: item
    });
}

export async function swap(args:PushArgs):Promise<unknown> {
    const {
        socket, 
        item
    } = args;

    return post({
        socket: socket,
        message: "SwapRequest",
        data: item
    })
}

export type PullArgs = ({
    socket:string;
});

export async function pull(args:PullArgs):Promise<unknown> {
    const {
        socket
    } = args;

    return post({
        socket: socket,
        message: "PullRequest"
    });
}

export async function wipe(args:PullArgs):Promise<unknown> {
    const {
        socket
    } = args;

    return post({
        socket: socket,
        message: "WipeRequest"
    });
}

export function cleanup(subs:EventSubscription[]):null {
    const subsLength:number = subs.length;

    for (let i = 0; i < subsLength; i++) {
        const sub:EventSubscription = subs[i];

        sub.remove();
    }

    return null;
}