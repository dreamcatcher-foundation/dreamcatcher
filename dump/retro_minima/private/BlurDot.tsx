import type React from "react";
import {animated, type SpringComponentProps} from "react-spring";
import {Color} from "./Config.ts";

export function BlurDot({
  style,
}: {
  style?: React.CSSProperties,
}): React.JSX.Element {
  return (<animated.div
  style={{...{
    background: `radial-gradient(
      closest-side,
      ${Color.PURPLE[0]},
      ${Color.PURPLE[0]},
      ${Color.BACKGROUND}
    )`, 
    position: "absolute",
    opacity: ".10"
  }, 
  ...style,}}></animated.div>);
}