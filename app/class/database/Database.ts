import type { IJsonFile } from "../host/file/IJsonFile.ts";
import { JsonFile } from "../host/file/JsonFile.ts";
import { Path } from "../host/Path.ts";
import { join } from "path";
import * as TsResult from "ts-results";

interface Database {}

const database = (function() {
    let _file: IJsonFile;
    let _;

    (function() {
        _file = JsonFile(Path({ _string: join(__dirname, "./Database.json") })).unwrap();
    })();

    function set(k: string, item: unknown): TsResult.Result<IJsonFile, unknown> {
        return _file.set(k, item);
    }

    
})();


database().set("", {});