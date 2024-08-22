import type { SpringValue } from "react-spring";
import type { ReactEventHandlers } from "react-use-gesture/dist/types";
import { Col } from "@component/Col";
import { RelativeUnit } from "@lib/RelativeUnit";
import * as ColorPalette from "src/public/component_/config/ColorPalette";
import { useSpring } from "react-spring";
import { useState } from "react";
import { useEffect } from "react";
import { useDrag } from "react-use-gesture";
import { useRef } from "react";
import { animated } from "react-spring";
import { config } from "react-spring";
import React from "react";

/// drag and drop
/// console ui
/// and programmable

export interface WindowProps {}

export function Window() {
    ///
    /// drag
    ///

    /// when true the window will move with the mouse and the cursor
    /// will be able to move it. vice versal when false the window will
    /// not move.
    let [_isBeingDragged, _setIsBeingDragged] = useState<boolean>(true);

    interface Position {
        x: SpringValue<RelativeUnit>;
        y: SpringValue<RelativeUnit>;
    }
    let _position: Position = useSpring({ x: RelativeUnit(0), y: RelativeUnit(0) });

    type Binding = (...args: any[]) => ReactEventHandlers;

    let _bindPosition: Binding = useDrag(state => {
        if (!_isBeingDragged) {
            return;
        }
        _position.x.set(RelativeUnit(_pxToVw(state.offset[0])));
        _position.y.set(RelativeUnit(_pxToVw(state.offset[1])));
        return;
    });

    function _pxToVw(px: number): number {
        return (px / window.innerWidth) * 100;
    }

    ///
    /// console
    ///

    let [_line, _setLine] = useState<(React.JSX.Element)[]>([]);

    function sendTextResponse() {
        _setLine(line => [... line, <div>Hi</div>])
    }

    useEffect(() => {
        sendTextResponse();
        sendTextResponse();
    }, []);

    ///
    /// component
    ///

    return <>
        <animated.div
        { ... _bindPosition() }
        style={{
            x: _position.x.to(x => `${ x }`),
            y: _position.y.to(y => `${ y }`),
            width: RelativeUnit(40),
            aspectRatio: "1/1",
            background: ColorPalette.DARK_OBSIDIAN.toString(),
            pointerEvents: "auto",
            cursor: "move",
            touchAction: "none",
            position: "absolute",
            padding: RelativeUnit(1.5)
        }}>
            { _line }
        </animated.div>
    </>;
}

function _convertPixelsToRelativeUnit(px: number): RelativeUnit {
    px /= window.innerWidth;
    px *= 100;
    return RelativeUnit(px);
}