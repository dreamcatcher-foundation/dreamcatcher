import {Path, PathLike} from "../Path.ts";
import {writeFileSync} from "fs";
import {InternalTag} from "../../lang/InternalTag.ts";

interface JsonPath extends Path, InternalTag {
    load: () => any;
    save: (object: object) => JsonPath;
}

function JsonPath(_pathLike: PathLike): JsonPath {
    const instance: JsonPath = {
        ...Path(_pathLike),
        ...InternalTag("JsonPath"),
        ...{
            load,
            save
        }
    };

    (function() {
        if (instance.extension() != "json") {
            throw new Error("INCOMPATIBLE_EXTENSION");
        }
    })();

    function load(): any {
        return JSON.parse(instance.content("utf8"));
    }

    function save(object: object): typeof instance {
        writeFileSync(instance.value(), JSON.stringify(object));
        return instance;
    }

    return instance;
}

export {JsonPath, PathLike};