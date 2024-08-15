import type { ComponentPropsWithRef, CSSProperties } from "react";
import type { ControllerUpdate } from "react-spring";
import type { Lookup } from "react-spring";
import type { SpringRef } from "react-spring";
import { EventSubscription } from "fbemitter";
import { EventEmitter } from "fbemitter";
import { Ref } from "@lib/Ref";
import { animated } from "react-spring";
import { useEffect, useState } from "react";
import { useSpring } from "react-spring";
import React from "react";

interface Radio {
    emit(eventType: string, ... data: unknown[]): Radio;
    respond(eventType: string, ... data: unknown[]): Radio;
    call(eventType: string, ... data: unknown[]): Promise<unknown[]>;
    poll(eventType: string, listener: Function): EventSubscription;
    pollOnce(eventType: string, listener: Function): EventSubscription;
    pollForResponse(eventType: string, listener: Function): EventSubscription;
}

export function Network() {
    let _events: EventEmitter = new EventEmitter();
    async function broadcast(eventType: string, ... data: unknown[]) {

    }
}

export function Radio() {
    let _: Radio = { emit, respond, call, poll, pollOnce, pollForResponse };
    let _events: EventEmitter = new EventEmitter();
    return _;
    function emit(eventType: string, ... data: unknown[]): Radio {
        _events.emit(eventType, ... data);
        return _;
    }
    function respond(eventType: string, ... data: unknown[]): Radio {
        _events.emit(_responseEventType(eventType), ... data);
        return _;
    }
    async function call(eventType: string, ... data: unknown[]): Promise<unknown[]> {
        return new Promise(resolve => {
            _events.once(_responseEventType(eventType), (... data: unknown[]) => {
                resolve(data);
            });
            _events.emit(eventType, ... data);
        });
    }
    function poll(eventType: string, listener: Function): EventSubscription {
        return _events.addListener(eventType, listener);
    }
    function pollOnce(eventType: string, listener: Function): EventSubscription {
        return _events.once(eventType, listener);
    }
    function pollForResponse(eventType: string, listener: Function): EventSubscription {
        return pollOnce(_responseEventType(eventType), listener);
    }
    function _responseEventType(eventType: string): string {
        return `${ eventType }Response`;
    }
}

export type SpringStyleSheet = ControllerUpdate<Lookup<any>, undefined>;

export function SpringStyleSheet(_: SpringStyleSheet): SpringStyleSheet {
    return _;
}

export type SpringStyleSheetFrame = SpringStyleSheet & {
    ms: number;
}

export function SpringStyleSheetFrame(_: SpringStyleSheetFrame): SpringStyleSheetFrame {
    return _;
}



/// states linked to animation targets, when the state changes to a new state
/// the animation will target the new state's animation sheet.
function AnimatedState() {

}




interface ControlledrProps extends ComponentPropsWithRef<typeof animated.div> {
    staticStyle?: CSSProperties;
}

interface Controlrler {
    Controlled(props: ControlledProps): React.JSX.Element;
    animate(target: AnimationTarget): Promise<unknown[]>;
}

export function Controllerr(): Controller {
    let _radio: Radio = Radio();
    let _isSynced: Promise<boolean> = new Promise(resolve => {
        _radio.pollOnce("componentMounted", () => {
            resolve(true);
        });
        return;
    });
    let _: Controller = { Controlled, animate };
    return _;
    function Controlled(props: ControlledProps): React.JSX.Element {
        let { staticStyle, style, children, ... more } = props;
        let [_spring, _setSpring] = useSpring(() => (style));
        let [_, _set] = useState<ControlledProps>(more);
        useEffect(() => {
            _radio.emit("componentMounted");
            return () => {
                _radio.emit("componentUnmounted");
                return;
            }
        }, []);
        useEffect(() => {
            let subscription: EventSubscription = _radio.poll("animate", (target: any) => {
                _setSpring.start(target);
                _radio.emit("animateResponse");
            });
            return () => {
                subscription.remove();
            }
        }, [_spring]);
        return <>
            <animated.div
            style={{
                ... _spring,
                ... staticStyle ?? {}
            }}
            { ... _}>
                { children }
            </animated.div>
        </>;
    }
    async function animate(target: SpringStyleSheet): Promise<unknown[]> {
        await _isSynced;
        return new Promise(resolve => {
            _radio.call("animate", target).then(data => resolve(data));
        });
    }

    async function moveLeft(pixels: number) {
        await _isSynced;
        return new Promise(resol)
    }
    async function moveRight() {}
    async function moveUp() {}
    async function moveDown() {}

    /// move to the direction using relative units based on the viewport with
    /// the position is consistence across all displays
    async function moveLeftRelative() {}
    async function moveRightRelative() {}
    
    /// set the on click handles dynamically
    async function onClick() {

    }
}





export type ControlledProps = ComponentPropsWithRef<typeof animated.div> & {}

export type Controller = {
    Controlled(props: ControlledProps): React.JSX.Element;
}

export function Controller(): Controller {
    let _isConnected: Ref<boolean> = Ref<boolean>(false);
    let _events: EventEmitter = new EventEmitter();
    return { Controlled };
    function Controlled(props: ControlledProps): React.JSX.Element {
        let { style, children, ... more } = props;
        let [_spring, _setSpring] = useSpring(() => style);
        let [_className, _setClassName] = useState<string>("");

        useEffect(() => {
            _connect();
            return () => _disconnect();

            function _connect(): void {
                _isConnected.set(true);
                return;
            }

            function _disconnect(): void {
                _isConnected.set(false);
                return;
            }
        }, []);

        useEffect(() => {
            let subscriptions: EventSubscription[] = [
                _setUpOnAnimateListener(),
                _setUpOnMountListener(),
                _setUpOnSetClassNameListener()
            ];

            return () => subscriptions.forEach(subscription => subscription.remove());

            function _setUpOnAnimateListener(): EventSubscription {
                return _events.addListener("animate", (... data: unknown[]) => {
                    let item: unknown = data[0];
                    if (!_isSpringStyleSheet(item)) return;
                    let styleSheet: SpringStyleSheet = item;
                    _setSpring.start(styleSheet);
                    _events.emit("animated");
                    return;

                    function _isSpringStyleSheet(item: unknown): item is SpringStyleSheet {

                    }
                });
            }

            function _setUpOnMountListener(): EventSubscription {
                return _events.addListener("mount", (... data: unknown[]) => {
                    let item: unknown = data[0];
                    if (!_isReactJsxElement(item)) return;
                    let element: React.JSX.Element = item;


                    function _isReactJsxElement(item: unknown): React.JSX.Element {

                    }
                });
            }

            function _setUpOnSetClassNameListener(): EventSubscription {
                return _setUpListener("setClassName", item => {
                    if (typeof item !== "string") return;
                    let className: string = item;
                    _setClassName(className);
                });
            }

            type Listener = (... data: unknown[]) => unknown;

            function _setUpListener(eventType: string, listener: Listener): EventSubscription {
                return _events.addListener(eventType, (... data: unknown[]) => {
                    listener();
                    _events.emit(`${ eventType }.done`);
                    return;
                });
            }
        });

        return <>
            <animated.div
            style={{}}>

            </animated.div>
        </>;

    }


}