import {EventEmitter} from "fbemitter";
import {broadcast} from "../connection/Connection.tsx";
import {Remote} from "./Remote.tsx";
import {Link} from "react-router-dom";

export function RemoteButton({name, network, text, width, height, goto, task}: {name: string; network: EventEmitter; text: string; width: string; height: string; goto?: string; task?: Function}) {
    const butterflyPurpleColor = "#615FFF";

    function onMouseEnter() {
        broadcast(network, `${name}::render::spring`, {
            background: butterflyPurpleColor
        });
        broadcast(network, `${name}::render::stylesheet`, {
            cursor: "pointer"
        });
    }

    function onMouseLeave() {
        broadcast(network, `${name}::render::spring`, {
            background: "transparent"
        });
        broadcast(network, `${name}::render::stylesheet`, {
            cursor: "auto"
        });
    }

    function onClick() {
        if (task) task();
    }

    function onMouseDown() {
        broadcast(network, `${name}::render::spring`, {
            background: "rgba(255, 255, 255, 0.5)"
        });
    }

    function onMouseUp() {
        broadcast(network, `${name}::render::spring`, {
            background: butterflyPurpleColor
        });
    }

    return (
        <div

            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}

            style={{
                width: width,
                height: height
            }}>

            <Remote

                name={name}
                network={network}
                
                initSpring={{
                    width: "100%",
                    height: "100%",
                    background: "transparent"
                } as any}

                initStylesheet={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: butterflyPurpleColor,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    WebkitBoxShadow: "0px 0px 300px 0px rgba(45, 255, 196, 0.9)",
                    MozBoxShadow: "0px 0px 300px 0px rgba(45, 255, 196, 0.9)",
                    boxShadow: "0px 0px 300px 0px rgba(45, 255, 196, 0.9)"
                }}>
                
                {goto ? <Link to={goto}>{text}</Link> : <div>text</div>}
            </Remote>
        </div>
    );
}