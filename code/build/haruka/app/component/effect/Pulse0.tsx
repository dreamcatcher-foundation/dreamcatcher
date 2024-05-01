import React, {type ReactNode} from "react";
import Pulse from "./Pulse.tsx";

export default function Pulse0(): ReactNode {
    return (
        <Pulse {...{
            name: "pulse0",
            delay: 4000,
            reverse: true,
            style: {
                position: "relative",
                bottom: "200px"
            }
        }}>
        </Pulse>
    );
}