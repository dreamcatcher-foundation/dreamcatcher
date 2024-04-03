import {broadcast, once} from "./design/Remote.tsx";
import StateConstructor from "./StateConstructor.tsx";s

export enum State {
    None,
    Idle,
    Deployment,
    Deploying,
    Installation,
    TakeMeThere
}

const window = (function() {
    let instance: {};

    async function _done() {
        return broadcast("window transition done");
    }

    async function _onDone(to: Function) {
        return once("window transition done", to);
    }

    
})();



const none = StateConstructor()
    .setParent("window")
    .setCooldown(100n)
    .setTo([

    ])
    .setFrom([
        
    ]);