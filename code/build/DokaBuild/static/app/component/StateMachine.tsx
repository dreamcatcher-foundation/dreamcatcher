import StateConstructor from "./StateConstructor";
import { once } from "./design/Remote";

type TState = ReturnType<typeof StateConstructor>;

export default function StateMachineConstructor() {
    let instance = {};
    let _stateNames: string[];
    let _states: TState[];
    let _isPersistant: boolean;

    function stateNames() {
        return _stateNames;
    }

    function states() {
        return _states;
    }

    function isPersistant() {
        return _isPersistant;
    }

    function enablePersistance() {
        _isPersistant = true;
    }

    function disablePersistance() {
        _isPersistant = false;
    }

    function _goto(to: string, from: string) {
        const stateNamesLength = stateNames().length;
        let indexFrom: number | undefined;
        let indexTo: number | undefined;
        for (let i = 0; i < stateNamesLength; i++) {
            if (stateNames()[i] === from)
                indexFrom = i;
            if (stateNames()[i] === to)
                indexTo = i;
        }
        const fromState = states()[indexFrom];
        const toState = states()[indexTo];
        _from(fromState);
        _to(toState);
    }

    function addState(stateName: string, state: TState) {
        if (!state.ok()) 
            throw new Error("StateMachine: cannot receive invalid state");
        _stateNames.push(stateName);
        _states.push(state);
        return instance;
    }

    function _from(state: TState) {
        once(`${state.parent()} transition done`, state.goFrom);
    }

    function _to(state: TState) {

    }
}