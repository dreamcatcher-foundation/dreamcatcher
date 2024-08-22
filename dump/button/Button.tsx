import type { ReactNode } from "react";
import type { ColProps } from "@component/Col";
import { Col } from "@component/Col";
import { Text } from "src/public/component_/text/Text";
import { U } from "@lib/RelativeUnit";
import { useSpring } from "react-spring";
import { config } from "react-spring";
import * as ColorPalette from "src/public/component_/config/ColorPalette";
import React from "react";

export type ButtonProps = ColProps & {
    label: string;
    borderColor?: string;
    textColor?: string;
    onClick?: Function;
}

export function Button(props: ButtonProps): React.JSX.Element {
    let { label, borderColor, textColor, onClick, ... more } = props;
    let [symbolSpring, animateSymbolSpring] = useSpring(() => ({ opacity: "0", config: config.stiff }));
    let [labelSpring, animateLabelSpring] = useSpring(() => ({ opacity: "1", config: config.stiff }));
    let [hiddenWrapperSpring, animateHiddenWrapperSpring] 
        = useSpring(() => ({
            width: U(15),
            height: U(3.75 * 2),
            top: U(-1.5),
            gap: U(1.5),
            config: config.stiff
        }));
    let fontSize: string = U(1.25);
    let color: string = textColor ?? ColorPalette.TITANIUM.toString();
    function _Container({ children }:{ children?: ReactNode }): ReactNode {
        return <>
            <Col
            onMouseEnter={() => {
                animateHiddenWrapperSpring.start({ top: U(1.5) });
                animateSymbolSpring.start({ opacity: "1" });
                animateLabelSpring.start({ opacity: "0" });
                return;
            }}
            onMouseLeave={() => {
                animateHiddenWrapperSpring.start({ top: U(-1.5) });
                animateSymbolSpring.start({ opacity: "0" });
                animateLabelSpring.start({ opacity: "1" });
                return;
            }}
            onClick={() => {
                if (onClick) onClick;
                return;
            }}
            style={{
                width: U(15),
                aspectRatio: "4/1",
                borderColor: borderColor ?? ColorPalette.GHOST_IRON.toString(),
                borderWidth: U(0.1),
                borderStyle: "solid",
                borderRadius: U(0.5),
                pointerEvents: "auto",
                cursor: "pointer",
                overflow: "hidden",
                background: ColorPalette.DARK_OBSIDIAN.toString()
            }}
            { ... more }>
                { children }
            </Col>
        </>;
    }
    function _HiddenWrapper({ children }:{ children?: ReactNode }): ReactNode {
        return <>
            <Col
            style={{
                position: "relative",
                ... hiddenWrapperSpring
            }}>
                { children }
            </Col>
        </>;
    }
    function _Symbol(): ReactNode {
        return <>
            <Text
            text="𖧶"
            style={{
                fontSize: fontSize,
                fontWeight: "bold",
                fontFamily: "satoshiRegular",
                color: color,
                textShadow: _glow(color, 1),
                ... symbolSpring
            }}/>
        </>;
    }
    function _Label(): ReactNode {
        return <>
            <Text
            text={ label }
            style={{
                fontSize: fontSize,
                color: color,
                ... labelSpring
            }}/>
        </>;
    }
    function _glow(color: string, strength: number): string {
        let strength0: number = strength * 1;
        let strength1: number = strength * 2;
        let strength2: number = strength * 3;
        let strength3: number = strength * 4;
        let strength4: number = strength * 5;
        let strength5: number = strength * 6;
        let distance0: U = U(strength0);
        let distance1: U = U(strength1);
        let distance2: U = U(strength2);
        let distance3: U = U(strength3);
        let distance4: U = U(strength4);
        let distance5: U = U(strength5);
        let shadow0: string = `0 0 ${ distance0 } ${ color }`;
        let shadow1: string = `0 0 ${ distance1 } ${ color }`;
        let shadow2: string = `0 0 ${ distance2 } ${ color }`;
        let shadow3: string = `0 0 ${ distance3 } ${ color }`;
        let shadow4: string = `0 0 ${ distance4 } ${ color }`;
        let shadow5: string = `0 0 ${ distance5 } ${ color }`;
        return `${ shadow0 }, ${ shadow1 }, ${ shadow2 }, ${ shadow3 }, ${ shadow4 }, ${ shadow5 }`;
    }
    return <>
        <_Container>
            <_HiddenWrapper>
                <_Symbol/>
                <_Label/>
            </_HiddenWrapper>
        </_Container>
    </>;
}