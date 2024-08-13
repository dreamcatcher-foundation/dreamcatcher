import type { ComponentPropsWithRef } from "react";
import { Link } from "react-router-dom";
import { Text } from "@component/Text";
import { RelativeUnit } from "@lib/RelativeUnit";
import { useSpring } from "react-spring";
import { config } from "react-spring";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";

export interface NavButtonProps extends ComponentPropsWithRef<typeof Link> {
    label: string;
}

export function NavButton(props: NavButtonProps): React.JSX.Element {
    let { label, style, to, children, ... more } = props;
    let [symbolSpring, setSymbolSpring] = useSpring(() => ({ opacity: "0", config: config.gentle }));
    let fontSize: string = RelativeUnit(1);
    let symbolColor: string = ColorPalette.DEEP_PURPLE.toString();
    let shadowSize: number = 1;
    let shadowSize0: number = shadowSize * 1;
    let shadowSize1: number = shadowSize * 2;
    let shadowSize2: number = shadowSize * 3;
    let shadowSize3: number = shadowSize * 4;
    let shadowSize4: number = shadowSize * 5;
    let shadowSize5: number = shadowSize * 6;
    let distance0: string = RelativeUnit(shadowSize0);
    let distance1: string = RelativeUnit(shadowSize1);
    let distance2: string = RelativeUnit(shadowSize2);
    let distance3: string = RelativeUnit(shadowSize3);
    let distance4: string = RelativeUnit(shadowSize4);
    let distance5: string = RelativeUnit(shadowSize5);
    let shadow0: string = `0 0 ${ distance0 } ${ symbolColor }`;
    let shadow1: string = `0 0 ${ distance1 } ${ symbolColor }`;
    let shadow2: string = `0 0 ${ distance2 } ${ symbolColor }`;
    let shadow3: string = `0 0 ${ distance3 } ${ symbolColor }`;
    let shadow4: string = `0 0 ${ distance4 } ${ symbolColor }`;
    let shadow5: string = `0 0 ${ distance5 } ${ symbolColor }`;
    let textShadow: string = `${ shadow0 }, ${ shadow1 }, ${ shadow2 }, ${ shadow3 }, ${ shadow4 }, ${ shadow5 }`;
    return <>
        <Link
        to={to}
        onMouseEnter={() => setSymbolSpring.start({ opacity: "1" })}
        onMouseLeave={() => setSymbolSpring.start({ opacity: "0" })}
        style={{
            pointerEvents: "auto",
            textDecoration: "none",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: RelativeUnit(1),
            ... style ?? {}
        }}
        { ... more }>
            <Text
            text="⇴"
            style={{
                fontSize: fontSize,
                fontWeight: "bold",
                fontFamily: "satoshiRegular",
                color: symbolColor,
                textShadow: textShadow,
                ... symbolSpring
            }}/>
            <Text
            text={ label }
            style={{
                fontSize: fontSize
            }}/>
        </Link>
    </>;
}