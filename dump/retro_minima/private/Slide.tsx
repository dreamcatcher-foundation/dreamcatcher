import {type CSSProperties} from "react";
import {animated, useSpring} from "react-spring";
export function Slide({
  positionX,
  positionY,
  background,
  style,
  children
}: {
  positionX?: number,
  positionY?: number,
  background?: string,
  style?: CSSProperties
  children?: React.ReactNode
}): React.JSX.Element {
  return <animated.div
  style={{...useSpring({from: {
    x: 0,
    y: positionY ?? window.innerHeight
  }, to: {
    x: positionX ?? 0,
    y: positionY ?? -window.innerHeight
  }}), ...{
    width: "100vw",
    height: "100vh",
    background: background ?? "#19181B",
    overflow: "hidden",
    fontSize: "8em",
    color: "#FFF"
  }, ...style}}>{children}
  I AM A SLIDE</animated.div>
}