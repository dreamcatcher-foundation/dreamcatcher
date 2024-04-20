import type {CSSProperties} from "react";
import {EventEmitter, EventSubscription} from "fbemitter";

export const defaultRequestEmitter:EventEmitter = new EventEmitter();
export const defaultResolveEmitter:EventEmitter = new EventEmitter();
export const defaultTimeout:number = 1000;

export type IHandler = ((data?:unknown) => unknown);

export function on(thisSocket:string, message:string, handler:IHandler, once?: boolean):EventSubscription {
    const signature:string = `${message}|${thisSocket}`;

    return once
    ? defaultRequestEmitter.once(signature, function(data?:unknown) {
        const response:unknown = handler(data);

        defaultResolveEmitter.emit(signature, response);
    })
    : defaultRequestEmitter.addListener(signature, function(data?:unknown) {
        const response:unknown = handler(data);

        defaultResolveEmitter.emit(signature, response);
    });
}

export async function post(toSocket:string, message:string, data?:unknown):Promise<unknown> {
    const signature:string = `${message}|${toSocket}`;

    return new Promise(function(resolve, reject) {
        let success:boolean = false;

        defaultResolveEmitter.once(signature, (response?:unknown) => resolve(response));
        defaultRequestEmitter.emit(signature, data);

        setTimeout(function() {
            if (!success) reject(null);
        }, defaultTimeout);
    });
}

type RenderArgs = ({
    socket:string;
    classname?:string;
    spring?:object;
    stye?:CSSProperties;
    text?:string;
});













export const reqStream: EventEmitter = new EventEmitter();
export const resStream: EventEmitter = new EventEmitter();


export type Signature = ({
    socket: string;
    message: stirng;
});


export type Post = ({
    toSocket: string;
    message: string;
    data?: any;
    timeout?: bigint;
    requestStream?: EventEmitter;
    resolveStream?: EventEmitter;
});



export type IRenderrArgs = ({
    toSocket: string;
    className?: string;
    spring?: object;
    style?: CSSProperties;
    text?: string;
});

export function render(args: IRenderArgs): void {
    const {
        toSocket,
        className,
        spring,
        style,
        text} = args;
    const classNameRenderRequest: string = "ClassNameRenderRequest";
    const springRenderRequest: string = "SpringRenderRequest";
    const styleRenderRequest: string = "StyleRenderRequest";
    const textRenderRequest: string = "TextRenderRequest";
    const toArgs = ({
        toSocket: toSocket});

    if (className) post({
        ...toArgs,
        message: classNameRenderRequest,
        data: className
    });

}

export function render(args: RenderArgs): void {
    _ifHasPropRenderClassName(args);
    _ifHasPropRenderSpring(args);
    _ifHasPropRenderStyle(args);
    _ifHasPropRenderText(args);
}

function _ifHasPropRenderClassName(args: RenderArgs): void {
    const {toSocket, className} = args;

    if (className) {
        post({
            toSocket: toSocket,
            message: "RenderClassNameRequest",
            data: className
        });
    }
}

function _ifHasPropRenderSpring(args: RenderArgs): void {
    const {toSocket, spring} = args;

    if (spring) {
        post({
            toSocket: toSocket,
            message: "RenderSpringRequest",
            data: spring
        });
    }
}

function _ifHasPropRenderStyle(args: RenderArgs): void {
    const {toSocket, style} = args;

    if (style) {
        post({
            toSocket: toSocket,
            message: "RenderStyleRequest",
            data: style
        });
    }
}

function _ifHasPropRenderText(args: RenderArgs): void {
    const {toSocket, text} = args;

    if (text) {
        post({
            toSocket: toSocket,
            message: "RenderTextRequest",
            data: text
        });
    }
}

export type PushArgs = ({
    toSocket: string;
    item: React.ReactNode;
});

export async function push(args: PushArgs) {
    const {toSocket, item} = args;

    return post({
        toSocket: toSocket,
        message: "PushRequest",
        data: item
    });
}

export async function swap(args: PushArgs) {
    const {toSocket, item} = args;


}

export type PullArgs = ({
    toSocket: string;
});

export async function pull(args: PullArgs) {
    const {toSocket} = args;

    return post({
        toSocket: toSocket,
        message: "PullRequest"
    });
}


export async function pull<Response>(toSocket: string): Promise<Response | null> {
    return new Promise(function(resolve) {
        const response: Promise<Response | null> = post<Response>({toSocket})
    });
}

export async function wipe<Response>(toSocket: string): Promise<Response | null> {
    return new Promise(function(resolve) {
        const response: Promise<Response | null> = post<Response>({toSocket: toSocket, message: "WipeMessage"});
        response.then((v) => resolve(v));
    });
}

export function cleanup(subs: EventSubscription[]): void {
    for (let i = 0; i < subs.length; i++) subs[i].remove();
}