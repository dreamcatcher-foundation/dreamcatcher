import {on, broadcast} from "./connection/Connection.tsx";
import {network} from "./connection/Network.tsx";
import {useState, useEffect} from "react";

export function State() {
    const [state, _state] = useState(localStorage.getItem("connected"));
    useEffect(function() {
        on(network(), "state::request", function() {
            broadcast(network(), "state::request::success", {
                connected: connected
            });
        });
    }, []);
    return (<div></div>);
}