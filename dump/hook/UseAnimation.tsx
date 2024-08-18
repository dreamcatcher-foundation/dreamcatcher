import type { CSSProperties } from "react";
import type { SpringValue } from "react-spring";
import { animated } from "react-spring";
import { useSpring } from "react-spring";

export type Dynamic = {
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    maxHeight?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    margin?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    borderWidth?: string;
    borderTopWidth?: string;
    borderRightWidth?: string;
    borderBottomWidth?: string;
    borderLeftWidth?: string;
    outlineWidth?: string;
    opacity?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderTopColor?: string;
    borderRightColor?: string;
    borderBottomColor?: string;
    borderLeftColor?: string;
    outlineColor?: string;
    textShadow?: string;
    transform?: string;
    transformOrigin?: string;
    perspective?: string;
    perspectiveOrigin?: string;
    borderRadius?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
    boxShadow?: string;
    outlineOffset?: string;
    letterSpacing?: string;
    wordSpacing?: string;
    lineHeight?: string;
    textIndent?: string;
    fontSize?: string;
    fontWeight?: string;
    textDecorationThickness?: string;
    textDecorationOffset?: string;
    backgroundPosition?: string;
    backgroundSize?: string;
    borderSpacing?: string;
    borderImageOutset?: string;
    borderImageSlice?: string;
    borderImageWidth?: string;
    zIndex?: string;
    clip?: string;
    columns?: string;
}

type CSSPropertiesExcludingAnimatable = Omit<CSSProperties, keyof Animatable>;

type StyleSheet = Animatable & CSSPropertiesExcludingAnimatable;

export function useAnimation(animatable: Animatable, static_: CSSPropertiesExcludingAnimatable) {
    let [styleSheet, animate] = useSpring(() => ({ ... animatable }));
    function Animated() {
        return <>
            <animated.div
            style={{ ... styleSheet, ... static_ }}/>
        </>;
    }
    return [Animated, animate];
}

useAnimation({
    width: "500px"
}, {
    
})