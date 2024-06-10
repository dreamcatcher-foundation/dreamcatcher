import type { IPrompt } from "./IPrompt.ts";

export function Prompt(_content: string): IPrompt {
    const _shards: string[] = [];
    const _: IPrompt = { shards, commands, args };

    (function() {
        _shards.push(..._content.split(" "));
    })();

    function shards(): string[] {
        return _shards;
    }

    function commands(): string[] {
        const result: string[] = [];
        for (let i = 0; i < shards().length; i++) {
            if (shards()[i].startsWith("-")) {
                result.push(shards()[i]);
            }
        }
        return result;
    }

    function args(): string[] {
        const result: string[] = [];
        for (let i = 0; i < shards().length; i++) {
            if (!shards()[i].startsWith("-")) {
                result.push(shards()[i]);
            }
        }
        return result;
    }

    return _;
}