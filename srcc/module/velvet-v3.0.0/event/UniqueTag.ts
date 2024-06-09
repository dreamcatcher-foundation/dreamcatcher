import uniqueString from "unique-string";

export default class UniqueTag {
    private static _$usedTags: string[] = [];
    private readonly _value: string = UniqueTag._randomString();

    public get value(): Readonly<string> {
        return this._value;
    }

    /**
     * WARNING There should be an extremely large amount of
     *         possible tags that can be generated, however,
     *         in an edge case, if too many tags have been
     *         used then it may take much longer to generate a
     *         tag or it may break if all tags have been used.
     */
    private static _randomString(): string {
        while (true) {
            const randomString: string = uniqueString();
            if (!UniqueTag._isUsedTag(randomString)) return UniqueTag._markAsUsedAndReturn(randomString)
        }
    }

    private static _markAsUsedAndReturn(string: string): string {
        UniqueTag._markAsUsed(string);
        return string;
    }

    private static _markAsUsed(string: string): void {
        UniqueTag._$usedTags.push(string);
        return;
    }

    private static _isUsedTag(string: string): boolean {
        return UniqueTag._$usedTags.includes(string);
    }
}