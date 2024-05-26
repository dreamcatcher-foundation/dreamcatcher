import type {ReactNode} from "react";
import Pulse from "./Pulse.tsx";

export default function Pulse1(): ReactNode {
    return <Pulse {...{
        delay: 8000,
        style: {
            position: "relative"
        },
        reverse: true
    }}>
    </Pulse>;
}