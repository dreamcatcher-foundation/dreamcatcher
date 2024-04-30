import type {ReactNode} from "react";
import Pulse from "./Pulse.tsx";

export default function Pulse0(): ReactNode {
    return <Pulse {...{
        delay: 4000,
        style: {
            position: "relative",
            bottom: "200px"
        },
        reverse: false
    }}>
    </Pulse>;
}