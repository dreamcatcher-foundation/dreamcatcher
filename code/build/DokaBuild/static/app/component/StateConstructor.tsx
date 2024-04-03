import {doStaggered} from "./Helper";

export default function StateConstructor() {
    let instance = {
        parent,
        cooldown,
        from,
        to,
        setParent,
        setCooldown,
        setFrom,
        setTo,
        goFrom,
        goTo,
        ok
    };
    let _parent: string;
    let _cooldown: bigint;
    let _from: Function[];
    let _to: Function[];

    function parent() {
        return _parent;
    }

    function cooldown() {
        return _cooldown;
    }

    function from() {
        return _from;
    }

    function to() {
        return _to;
    }

    function setParent(parent: string) {
        _parent = parent;
        return instance;
    }

    function setCooldown(cooldown: bigint) {
        _cooldown = cooldown;
        return instance;
    }

    /** Set the transition process from this state. */
    function setFrom(fns: Function[]) {
        _from = fns;
        return instance;
    }

    /** Set the transition process to this state. */
    function setTo(fns: Function[]) {
        _to = fns;
        return instance;
    }

    function goFrom() {
        doStaggered(from(), cooldown(), parent());
        return instance;
    }

    function goTo() {
        doStaggered(to(), cooldown(), parent());
        return instance;
    }

    function ok() {
        if (!parent() || !cooldown() || !from() || !to()) {
            return false;
        }
        return true;
    }

    return instance;
}