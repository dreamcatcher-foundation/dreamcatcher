import type {CSSProperties} from "react";
import {EventEmitter, EventSubscription} from "fbemitter";

export type Network = ({
    reqEmitter:()=>EventEmitter;
    resEmitter:()=>EventEmitter;
});

export const network:()=>Network = (function():()=>Network {
    let instance:Network;

    const _reqEmitter:EventEmitter = new EventEmitter();
    const _resEmitter:EventEmitter = new EventEmitter();

    const reqEmitter = () => _reqEmitter;
    const resEmitter = () => _resEmitter;

    return function():Network {
        if (!instance) instance = ({
            reqEmitter,
            resEmitter
        });

        return instance;
    }
})();

export type Handler = ((data?:unknown) => unknown);

export type OnArgs = ({
    socket:string;
    message:string;
    handler:Handler;
    once?:boolean;
});

export function on(args:OnArgs):EventSubscription {
    const {
        socket,
        message,
        handler,
        once
    } = args;

    const signature:string = `${message}|${socket}`;
    
    const sub:EventSubscription = once
        ? network()
            .reqEmitter()
            .once(signature, function(data?:unknown) {
                const response:unknown = handler(data);
                
                network()
                    .resEmitter()
                    .emit(signature, response);
            })
        
        : network()
            .reqEmitter()
            .addListener(signature, function(data?:unknown) {
                const response:unknown = handler(data);

                network()
                    .resEmitter()
                    .emit(signature, response);
            })
    
    return sub;
}

export type PostArgs = ({
    socket:string;
    message:string;
    data?:unknown;
});

export async function post(args:PostArgs):Promise<unknown> {
    const {
        socket,
        message,
        data
    } = args;

    const signature:string = `${message}|${socket}`;

    return new Promise(function(resolve, reject) {
        let success:boolean = false;

        network()
            .resEmitter()
            .once(signature, (response?:unknown) => resolve(response));

        network()
            .reqEmitter()
            .emit(signature, data);

        setTimeout(function() {
            if (!success) reject(null);
        }, 1000);
    });
}

export type RenderArgs = ({
    socket:string;
    className?:string;
    spring?:object;
    style?:CSSProperties;
    text?:string;
});

export function render(args:RenderArgs):(Promise<unknown>)[] {
    const {
        socket,
        className,
        spring,
        style,
        text
    } = args;

    const responses:(Promise<unknown>)[] = [];

    if (className) responses.push(post({
        socket: socket,
        message: "RenderClassNameRequest",
        data: className
    }));

    if (spring) responses.push(post({
        socket: socket,
        message: "RenderSpringRequest",
        data: spring
    }));

    if (style) responses.push(post({
        socket: socket,
        message: "RenderStyleRequest",
        data: style
    }));

    if (text) responses.push(post({
        socket: socket,
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