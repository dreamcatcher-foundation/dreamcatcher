

class State {
    public onEntry() {
        return this;
    }

    public onExit() {
        return this;
    }

    public on(event: string, state: State) {
        return this;
    }
}

class Machine {


    public setInitialState(state: State) {
        return this;
    }

    public send() {}

    public addState(state: State) {
        return this;
    }
}



let fetching: State = new State();
let initial: State = new State()
    .on("fetch", fetching);
new Machine()
    .setInitialState(initial);

