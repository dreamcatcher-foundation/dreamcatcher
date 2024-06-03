export class Prompt {
    protected _shards: string[] = [];

    public constructor(content: string) {
        this._shards = content.split(" ");
    }

    public shards(): string[] {
        return this._shards;
    }
}