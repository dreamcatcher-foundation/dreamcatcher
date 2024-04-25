export default class Path {
    public constructor(protected readonly _path: string) {}

    public get(): string {
        return this._path;
    }

    public name(): string | null {
        return this
            ._path
           ?.split("/")
           ?.pop()
           ?.split(".")
           ?.at(-2) || null;
    }
}