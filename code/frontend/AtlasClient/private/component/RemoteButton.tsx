import {EventEmitter} from "fbemitter";
import {broadcast} from "../connection/Connection.tsx";
import {Remote} from "./Remote.tsx";
import {Link} from "react-router-dom";

export function RemoteButton(props: IRemoteButtonProps) {
    const purple = "#615FFF" as const;

    return (
        <Remote name={props.name} network={props.network} initSpring={initSpring()} initStylesheet={initStylesheet()}>
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} style={innerStylesheet()}>
                {props.goto ? <Link to={props.goto}>{props.text}</Link> : <div>{props.text}</div>}
            </div>
        </Remote>
    );

    function onClick() {
        ifTaskIsDefinedPerformIt();
        return;
    }

    function ifTaskIsDefinedPerformIt() {
        if (props.task) props.task();
        return;
    }

    function onMouseLeave() {
        contract();
        setCursorToAuto();
        return;
    }

    function setCursorToAuto() {
        broadcast(props.network, `${props.name}::render::stylesheet`, {
            cursor: "auto"
        });
        return;
    }

    function contract() {
        broadcast(props.network, `${props.name}::render::spring`, {
            width: props.minWidth,
            height: props.minHeight
        });
        return;
    }

    function onMouseEnter() {
        expand();
        setCursorToPointer();
        return;
    }

    function setCursorToPointer() {
        broadcast(props.network, `${props.name}::render::stylesheet`, {
            cursor: "pointer"
        });
        return;
    }

    function expand() {
        broadcast(props.network, `${props.name}::render::spring`, {
            width: props.maxWidth,
            height: props.maxHeight
        });
        return;
    }

    function innerStylesheet() {
        return {
            width: "100%",
            height: "100%",
            color: purple
        } as const;
    }

    function initSpring() {
        return {
            width: props.minWidth,
            height: props.minHeight,
            background: "transparent"
        } as any;
    }

    function initStylesheet() {
        return {
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: purple,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        } as const;
    }
}

type IRemoteButtonProps = {
    name: string;
    network: EventEmitter;
    text: string;
    minWidth: string;
    minHeight: string;
    maxWidth: string;
    maxHeight: string;
    goto?: string;
    task?: Function;
}