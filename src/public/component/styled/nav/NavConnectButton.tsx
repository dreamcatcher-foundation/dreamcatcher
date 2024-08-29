import type {ReactNode} from "react";
import {Typography} from "@component/Typography";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMachine} from "@xstate/react";
import {useMemo} from "react";
import {connect} from "@component/Client";

export function NavConnectButton(): ReactNode {

    return <>
        <Typography
        content={"Connect"}
        style={{
            fontSize: "1.5em"
        }}/>
    </>;
}