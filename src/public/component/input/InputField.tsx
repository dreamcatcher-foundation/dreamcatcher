import type {ReactNode} from "react";
import {Typography} from "@component/Typography";
import {FlexRow} from "@component/FlexRow";
import {createMachine as Machine} from "xstate";
import {useSpring, useSpringValue} from "react-spring";
import {useMachine} from "@xstate/react";
import {useEffect, useMemo, useState} from "react";
import {textShadowGlow} from "@component/TextShadowGlow";
import {config} from "react-spring";
import * as ColorPalette from "@component/ColorPalette";

export function InputField({placeholder}: {placeholder?: string;}): ReactNode {
    let [starLightStrength, setStarLightStrength] = useState(0);
    return <>
        <FlexRow onMouseEnter={() => setStarLightStrength(10)} onMouseLeave={() => setStarLightStrength(0)} style={{gap: "5px", padding: "10px", pointerEvents: "auto"}}>
            <Star strength={starLightStrength}/>
            <input type="text" placeholder={placeholder} style={{all: "unset", width: "100px", fontSize: "0.75em", pointerEvents: "auto", cursor: "text", color: ColorPalette.TITANIUM.toString(), fontWeight: "bold", fontFamily: "satoshiRegular"}}/>
        </FlexRow>
    </>;
}





export function Star({strength}: {strength: number}): ReactNode {
    let [spring, setSpring] = useSpring(() => ({color: ColorPalette.TITANIUM.toString(), textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), 0), config: config.gentle}));
    useEffect(() => {
        setSpring.start({textShadow: textShadowGlow(ColorPalette.TITANIUM.toString(), strength)});
    }, [strength]);
    return <><Typography content="✦" style={{... spring}}/></>;
}