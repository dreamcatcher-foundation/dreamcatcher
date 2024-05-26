import type {ReactNode} from "react";
import BlurDot from "./BlurDot.tsx";
import UniqueTag from "../../../event/UniqueTag.ts";

export const blurDot0 = new UniqueTag();

export default function BlurDot0(): ReactNode {
    return <BlurDot {...{
        tag: blurDot0,
        color0: "#615FFF",
        color1: "#161616",
        style: {
            width: "1000px",
            height: "1000px",
            position: "absolute",
            right: "600px",
            bottom: "200px"
        }
    }}>
    </BlurDot>;
}