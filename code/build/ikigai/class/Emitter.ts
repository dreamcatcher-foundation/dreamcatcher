import type {CSSProperties} from "react";
import {EventEmitter, EventSubscription} from "fbemitter";

const defaultRequestEmitter: EventEmitter = new EventEmitter();
const defaultResolveEmitter: EventEmitter = new EventEmitter();
const defaultTimeout: bigint = 1000n;

export type Handler = ((args?: unknown) => unknown);

export function on() {
    let _socket: string | undefined;
    let _message: string | undefined;
    let _handler: Handler | undefined;
    let _once: boolean | undefined;
    let _requestEmitter: EventEmitter | undefined;
    let _resolveEmitter: EventEmitter | undefined;

    const instance = ({
        useSocket,
        useMessage,
        useHandler,
        useOnce,
        useRequestEmitter,
        useResolveEmitter,
        execute
    });

    function useSocket(socket: string) {
        _socket = socket;
        return instance;
    }

    function useMessage(message: string) {
        _message = message;
        return instance;
    }

    function useHandler(handler: Handler) {
        _handler = handler;
        return instance;
    }

    function useOnce() {
        _once = true;
        return instance;
    }

    function useRequestEmitter(emitter: EventEmitter) {
        _requestEmitter = emitter;
        return instance;
    }

    function useResolveEmitter(emitter: EventEmitter) {
        _resolveEmitter = emitter;
        return instance;
    }

    function execute() {
        if (!_message) return undefined;
        if (!_handler) return undefined;
        const signature: string = `${_message}|${_socket ?? ""}`;
        const selectedRequestEmitter: EventEmitter = _requestEmitter ?? defaultRequestEmitter;
        const selectedResolveEmitter: EventEmitter = _resolveEmitter ?? defaultResolveEmitter;

        if (_once) return selectedRequestEmitter.once(signature, function(data?: unknown) {
            const response: unknown = _handler!(data);
            selectedResolveEmitter.emit(signature, response);
        });

        return selectedRequestEmitter.addListener(signature, function(data?: unknown) {
            const response: unknown = _handler!(data);
            selectedResolveEmitter.emit(signature, response);
        });
    }

    return instance;
}

export function post() {
    let _socket: string | undefined;
    let _message: string | undefined;
    let _args: unknown;
    let _timeout: bigint;
    let _requestEmitter: EventEmitter | undefined;
    let _resolveEmitter: EventEmitter | undefined;

    const instance = ({
        useSocket,
        useMessage,
        useArgs,
        useTimeout,
        useRequestEmitter,
        useResolveEmitter,
        execute
    });

    function useSocket(socket: string) {
        _socket = socket;
        return instance;
    }

    function useMessage(message: string) {
        _message = message;
        return instance;
    }

    function useArgs(args: unknown) {
        _args = args;
        return instance;
    }

    function useTimeout(timeout: bigint) {
        _timeout = timeout;
        return instance;
    }

    function useRequestEmitter(emitter: EventEmitter) {
        _requestEmitter = emitter;
        return instance;
    }

    function useResolveEmitter(emitter: EventEmitter) {
        _resolveEmitter = emitter;
        return instance;
    }

    function execute() {
        if (!_message) return undefined;
        const signature: string = `${_message}|${_socket ?? ""}`;
        const selectedRequestEmitter: EventEmitter = _requestEmitter ?? defaultRequestEmitter;
        const selectedResolveEmitter: EventEmitter = _resolveEmitter ?? defaultResolveEmitter;

        return new Promise(function(resolve, reject) {
            let success: boolean = false;
            selectedResolveEmitter.once(signature, (response?: unknown) => resolve(response));
            selectedRequestEmitter.emit(signature, _args);

            setTimeout(function() {
                if (!success) reject(undefined);
            }, Number(_timeout ?? defaultTimeout));
        });
    }

    return instance;
}