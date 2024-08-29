import type {ReactNode} from "react";
import type {NavButtonProps} from "@component/NavButtonProps";
import {Link} from "react-router-dom";
import {Typography} from "@component/Typography";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMachine} from "@xstate/react";
import {useMemo} from "react";
import {config} from "react-spring";
import {textShadowGlow} from "@component/TextShadowGlow";
import * as ColorPalette from "@component/ColorPalette";

export function NavButton(props: NavButtonProps): ReactNode {
    let {caption0, caption1, style, ... more} = props;
    let [spring, setSpring] = useSpring(() => ({
        fontSize: "1em",
        fontWeight: "normal",
        fontFamily: "satoshiRegular",
        color: ColorPalette.TITANIUM.toString(),
        textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), 0),
        config: config.stiff
    }));
    let [_, setNavButton] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiVAewFdYwBRfAFzACcBtABgC6iUAAc6sXO1x18wkAA9EAJj4BWEgE4lADgCMO7RtUBmfQDYlAGhABPRLtMldAdlV8+u7UrcaALDoBfAOs0LDxCUmw6ADduAihaRmYAGTB0WP4hJBAxCSkZOUUEFXUtPQMjUyULazsEPRI+DWNnX2bnbQtdCyDgkHw6CDg5UJwCYjlcyWlZbKKAWjNaxEWgkIwxiLJKMEnxaYK5xH9lhC0SYyVjDTNzMz5jPk61kFHw4hIo2K54vbyZwqIYz3Eg6XzGQx8XwWPRLWyIPwkLzXW7Ve6PZ69IA */
        initial: "idle",
        states: {
            idle: {
                entry: () => setSpring.start({textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), 0)}),
                on: {
                    mouseEnter: "hovering"
                }
            },
            hovering: {
                entry: () => setSpring.start({textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), 0.25)}),
                on: {
                    mouseLeave: "idle"
                }
            }
        }
    }), [setSpring, setSpring]));
    return <>
        <Link
        onMouseEnter={() => setNavButton({type: "mouseEnter"})}
        onMouseLeave={() => setNavButton({type: "mouseLeave"})}
        style={{
            pointerEvents: "auto",
            textDecoration: "none",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            ... style ?? {}
        }}
        {... more}>
            <Typography
            content={caption0}
            style={{
                fontSize: "1em",
                fontWeight: "bold",
                fontFamily: "satoshiRegular",
                color: ColorPalette.DEEP_PURPLE.toString()
            }}/>
            <Typography
            content={caption1}
            style={{
                ... spring
            }}/>
        </Link>
    </>;
}