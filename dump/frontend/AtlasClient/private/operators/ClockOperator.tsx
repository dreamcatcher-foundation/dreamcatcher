import {on, broadcast} from "../connection/Connection.tsx";
import {network} from "../connection/Network.tsx";

export function includeClockOperator() {
    setInterval(function() {
        broadcast(network(), "clock::updated");
    }, 1 * 1000);
}