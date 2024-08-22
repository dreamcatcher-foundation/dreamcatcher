import type {ReactNode} from "react";
import type {NavButtonProps} from "@component/NavButtonProps";
import {Link} from "react-router-dom";
import {useSpring} from "react-spring";
import {config} from "react-spring";
import * as ColorPalette from "@component/ColorPalette";

export function NavButton(props: NavButtonProps): ReactNode {
    let [spring0, setSpring0] = useSpring(() => ({
        fontSize: "1em",
        fontWeight: "bold",
        fontFamily: "satoshiRegular",
        color: ColorPalette.TITANIUM.toString(),
        config: config.stiff
    }));
    let [spring1, setSpring1] = useSpring(() => ({
        color: "",
        config: config.stiff
    }));
    
}