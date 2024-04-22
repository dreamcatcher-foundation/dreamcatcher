import uniqueString from "unique-string";

const _usedTags: string[] = [];

export type UniqueTag = string & {__type: "UniqueTag"};

export function UniqueTag(): UniqueTag {
    let _isUnique: boolean = false;
    let _result: string = "";
    while (!_isUnique) {
        let _string: string = uniqueString();
        let _sixHexString: string = _string.slice(0, 4);
        let _resultString: string = "";
        _resultString += "0";
        _resultString += "x";
        _resultString += _sixHexString;
        let _hasTag: boolean = _usedTags.includes(_resultString);
        if (!_hasTag) {
            _usedTags.push(_resultString);
            _result = _resultString;
            _isUnique = true;
        }
    }
    return _result as UniqueTag;
}