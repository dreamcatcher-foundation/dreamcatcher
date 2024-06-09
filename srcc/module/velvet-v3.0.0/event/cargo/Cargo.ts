import EventsHub from "../EventsHub.ts";

export default class Cargo<Layout> {
    public constructor(private readonly _$crate: Layout) {}

    public get(): Layout {
        return structuredClone(this._$crate);
    }

    public ship() {
        EventsHub.post("", "", this);
    }
}