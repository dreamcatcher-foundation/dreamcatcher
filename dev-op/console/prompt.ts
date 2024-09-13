export interface Prompt {
    shards(): string[];
}

export function Prompt(_answer: string): Prompt {
    let _shards: string[];
    /***/ {
        _shards = [];
        _shards = _answer.split(" ");
        return {shards};
    }
    function shards(): string[] {
        return _shards;
    }
}