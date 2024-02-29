import type {CSSProperties} from "react";
import {Flex} from "chakra-ui";

export function SteelFrame({
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
    borderStyle: "solid"
  }} style={{
    borderImage: `linear-gradient(to bottom, #505050, transparent) 1`,
    ...style ?? {}
  }}>
    {children}
  </Flex>);
}