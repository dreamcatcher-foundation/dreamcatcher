export default class Secret {
    public constructor(
        private _key: string
    ) {}

    public get(): string {
        const content:
            | string
            | undefined = process
                ?.env
                ?.[this._key];
        if (!content) {
            throw new Error(`Secret: secret key ${this._key} is undefined`);
        }
        return content;
    }
}