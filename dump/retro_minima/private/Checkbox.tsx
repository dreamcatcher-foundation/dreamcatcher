import {useSpring, animated} from "react-spring";
import React, {useEffect, useState} from "react";
import {Color, RetroMinimaBoxShadow} from "./Config.ts";
import {type Unit, type ColorHex} from "./middleware/Jasmin/Jasmin.ts";

export function Checkbox({
  size,
  color,
  activeColor,
  isInitiallyHovering,
  isInitiallyActive
}: {
  size: Unit,
  color?: ColorHex,
  activeColor?: ColorHex,
  isInitiallyHovering?: boolean,
  isInitiallyActive?: boolean
}): React.JSX.Element {
  color = color ?? Color.Base;
  activeColor = activeColor ?? Color.Active;
  isInitiallyHovering = isInitiallyHovering ?? false;
  isInitiallyActive = isInitiallyActive ?? false;
  const [hover, toggleHover] = useState(isInitiallyHovering);
  const [active, toggleActive] = useState(isInitiallyActive);

  function computeOutlineSize() {
    if (hover) {
      return "100%";
    } return "90%"
  }

  function computeDotBoxShadowColor() {
    if (active) {
      return RetroMinimaBoxShadow({color: activeColor});
    } return RetroMinimaBoxShadow({color: "transparent" as ColorHex});
  }

  function computeDotBackgroundColor() {
    if (active) {
      return activeColor;
    } return "transparent";
  }

  return (
    <animated.div style={{...{ /** Wrapper */ 
      width: size,
      height: size,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      userSelect: "none",
      cursor: "pointer"
    }}} onMouseEnter={function() {
      return toggleHover(true);
    }} onMouseLeave={function() {
      return toggleHover(false);
    }} onClick={function() {
      if (!active) {
        return toggleActive(true);
      } return toggleActive(false);
    }}>

      <animated.div style={{...useSpring({ /** Outline */
        width: computeOutlineSize(),
        height: computeOutlineSize(),
        boxShadow: RetroMinimaBoxShadow({}), 
        config: {
          tension: 25_000,
          friction: 3.75,
          bounce: 1
      }}), ...{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}}>

        <animated.div style={{...useSpring({ /** Dot */
        width: "50%",
        height: "50%",
        config: {
          tension: 25_000,
          friction: 3.75
        }}), ...{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }, ...useSpring({
          boxShadow: computeDotBoxShadowColor(),
          background: computeDotBackgroundColor(), config: {
            friction: 10,
            tension: 50_000
          }
        })}}>
        </animated.div>
      </animated.div>
    </animated.div>
  );
}