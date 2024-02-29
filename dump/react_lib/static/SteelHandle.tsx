import type {CSSProperties} from "react";
import {Flex} from "chakra-ui";

export function SteelHandle({
  width,
  height,
  style,
  children
}: {
  width: string;
  height: string;
  style?: CSSProperties
        | undefined;
  children?: JSX.Element
           | undefined;
}): JSX.Element {
  return (<Flex {...{
    fontSize: "base",
    letterSpacing: "normal",
    lineHeight: "normal",
    wordBreak: "normal",
    as: "",
    width: width,
    height: height,
    borderWidth: "1px",
    borderStyle: "solid",
    backgroundImage: "#171718"
  }} style={{
    borderImage: "linear-gradient(to top, #474647, transparent) 1",
    ...style
  }}>
    {children}
  </Flex>)
}