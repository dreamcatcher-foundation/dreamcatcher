import type { SpringValue } from "react-spring";
import type { Lookup } from "react-spring";
import type { CSSProperties } from "react";
import type { ControllerUpdate } from "react-spring";
import { useSpring } from "react-spring";
export type AnimatableStyleSheet = { [K in keyof CSSProperties]: SpringValue<CSSProperties[K]> | CSSProperties[K]; };
export type AnimateFunction = (styleSheet: ControllerUpdate<AnimatableStyleSheet>) => void;
export type UseAnimatableStyleSheetHook = [{ [x: string]: unknown }, AnimateFunction];
/**
 * note that some properties are not animatable in the stylesheet and will just not
 * work if you use them there. to use those properties just assign them directly on the
 * component's stylesheet. as to which one's are and which one's are not, i leave you
 * with my blessings.
 */
export function useAnimation(styleSheetInit: AnimatableStyleSheet = {}): UseAnimatableStyleSheetHook {
    let [styleSheet, setStyleSheet] = useSpring(() => ({ ... styleSheetInit }));
    function animate(styleSheet: ControllerUpdate<AnimatableStyleSheet>) {
        /// the conversion to lookup is required or it throws a fit.
        setStyleSheet.start(styleSheet as ControllerUpdate<Lookup<AnimatableStyleSheet>>);
        return;
    }
    return [styleSheet, animate];
}