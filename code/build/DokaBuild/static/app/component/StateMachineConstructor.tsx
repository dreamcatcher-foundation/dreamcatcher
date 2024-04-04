import StateConstructor from "./StateConstructor";
import {broadcast, once} from "./design/Remote";

type TState = ReturnType<typeof StateConstructor>;

export default function StateMachineConstructor() {
    let instance = {
        stateNames,
        states,
        goto,
        addState
    };
    let _stateNames: string[];
    let _states: TState[];

    function stateNames() {
        return _stateNames;
    }

    function states() {
        return _states;
    }

    function goto(to: string, from?: string) {
        if (!from) {
            const stateNamesLength = stateNames().length;
            let toState: TState;
            for (let i = 0; i < stateNamesLength; i++) {
                const stateName = stateNames()[i];
                const state = states()[i];
                if (stateName === to) {
                    toState = state;
                }
            }
            once(`${toState!.parent()} transition done`, toState!.goTo);
            broadcast(`${toState!.parent()} transition done`);
            return;
        }
        const stateNamesLength = stateNames().length;
        let toState: TState;
        let fromState: TState;
        for (let i = 0; i < stateNamesLength; i++) {
            const stateName = stateNames()[i];
            const state = states()[i];
            if (stateName === to) {
                toState = state;
            }
            if (stateName === from) {
                fromState = state;
            }
            once(`${toState!.parent()} transition done`, toState!.goTo);
            fromState!.goFrom();
            return;
        }
    }

    function addState(stateName: string, state: TState) {
        if (!state.ok()) 
            throw new Error("StateMachine: cannot receive invalid state");
        _stateNames.push(stateName);
        _states.push(state);
        return instance;
    }

    return instance;
}