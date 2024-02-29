import type {CSSProperties} from "react";
import {Flex} from "chakra-ui";
import {SteelHandle} from "./SteelHandle.tsx";

export function SoftObsidianContainer({
  width,
  height,
  style,
  children
}: {
  width: string,
  height: string,
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
  }}>
    
  </Flex>)
}