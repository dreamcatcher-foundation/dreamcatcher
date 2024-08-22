import type { ComponentPropsWithRef } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Text } from "src/public/component_/text/Text";
import { U } from "@lib/RelativeUnit";
import { useSpring } from "react-spring";
import { config } from "react-spring";
import { useMemo, useState } from "react";
import { createMachine as Machine } from "xstate";
import { useMachine } from "@xstate/react";
import * as ColorPalette from "src/public/component_/config/ColorPalette";

export interface NavButtonProps extends Omit<ComponentPropsWithRef<typeof Link>, "to"> {
    label: string;
    goto?: string;
    to?: string;
}

export function NavButton(props: NavButtonProps): ReactNode {
    let { label, goto, style, to, children, ... more } = props;
    if (!to) to = "/";
    if (goto) to = "/";
    let [symbolSpring, setSymbolSpring] = useSpring(() => ({ 
        opacity: "0", 
        fontSize: U(1),
        fontWeight: "bold",
        fontFamily: "satoshiRegular",
        color: ColorPalette.DEEP_PURPLE.toString(),
        textShadow: glow(ColorPalette.DEEP_PURPLE.toString(), 1),
        config: config.gentle 
    }));
    let [labelSpring, setLabelSpring] = useSpring(() => ({
        opacity: "0",
        fontSize: U(1)
    }));
    let [, send] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbAYggHtCBtABgF1FQAHR2SrmbcQAD0QAmNgFYSATgkAOAIwAWVcuka2agDQgAnpLZySyxaoDMAdksbpDudYkBfF-rRY8hUrgg0wOlRGAFdYMABRfAowACd2LiQQPgEqYSTxBAllNjMANmk81WtlS0VpGTk8-SMEOVzrVUU5Qq0Cy2llazcPDBwCYhJsRgA3OKDQ8IAZMHQxhJEUwXTQTKlZBRV1TW09Q0Q1XMVLNilmuRO2a0U3dxB8Rgg4EU9+n0X+ZfwRTIBaav2CH+JDYoLB4PB3Tur28g3IVFoH1SQm+GUQqgkILBmgk0kU13xihqB0UeTMKgkqha0ikJQkrmhfVhvn8YCRXx+iEseVySm2LTyZWkF2JCGUUhIlgk1jY5XFLWUFx6IBhA1IwzGsXZaVRq3RElFKhBF0aJtJ2TyDLcQA */
        initial: "initial",
        states: {
            initial: {
                entry: () => {
                    setLabelSpring.start({ opacity: "1" });
                    send({ type: "done" });
                    return;
                },
                on: {
                    done: "idle"
                }
            },
            idle: {
                entry: () => {
                    setSymbolSpring.start({ opacity: "0" });
                    return;
                },
                on: {
                    mouseEnter: "hover"
                }
            },
            hover: {
                entry: () => {
                    setSymbolSpring.start({ opacity: "1" });
                    return;
                },
                on: {
                    mouseLeave: "idle"
                }
            }
        }
    }), []));
    function glow(color: string, strength: number): string {
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
        <Link
        to={ to }
        onMouseEnter={ () => send({ type: "mouseEnter" }) }
        onMouseLeave={ () => send({ type: "mouseLeave" }) }
        style={{
            pointerEvents: "auto",
            textDecoration: "none",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: U(1),
            ... style
        }}
        { ... more }>
            <Text
            text="⇴"
            style={{ ... symbolSpring }}/>
            <Text
            text={ label }
            style={{ ... labelSpring }}/>
        </Link>
    </>;
}