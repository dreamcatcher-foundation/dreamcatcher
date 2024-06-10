import type { IPrompt } from "./IPrompt.ts";

export function Prompt(_content: string): IPrompt {
    const _shards: string[] = [];
    const _: IPrompt = { shards };

    (function() {
        _shards.push(..._content.split(" "));
    })();

    function shards(): string[] {
        return _shards;
    }

    return _;
}