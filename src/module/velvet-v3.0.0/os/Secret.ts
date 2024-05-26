export default class Secret {
    public constructor(private _key: string) {}

    public get(): string | null {
        const content: string | undefined = process
            ?.env
            ?.[this._key];
        return content ?? null;
    }
}