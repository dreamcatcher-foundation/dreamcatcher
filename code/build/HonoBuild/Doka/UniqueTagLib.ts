import uniqueString from "unique-string";

let _usedTags: string[] = [];

export type IUniqueTag = string & {__type: "UniqueTag"};

export function uniqueTag() {
    let isUnique: boolean = false;
    let result: string = "";
    while (!isUnique) {
        let string: string = uniqueString();
        let sixHexString: string = string.slice(0, 4);
        let resultString: string = "";
        resultString += "0";
        resultString += "x";
        resultString += sixHexString;
        let hasTag: boolean = _usedTags.includes(resultString);
        if (!hasTag) {
            _usedTags.push(resultString);
            result = resultString;
            isUnique = true;
        };
    }
    return result as IUniqueTag;
}