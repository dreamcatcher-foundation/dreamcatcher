import { type IJsonFile } from "./IJsonFile.ts";
import { type IPath } from "../IPath.ts";
import { File } from "./File.ts";
import * as TsResult from "ts-results";
import FileSystem from "fs";

export function JsonFile(_path: IPath) {
    const _: IJsonFile = { ...File(_path), set, get };

    function set(k: string, item: unknown): TsResult.Result<typeof _, unknown> {
        try {
            const content: unknown 
                = _exists()
                    ? JSON.parse(_.content().unwrap().toString("utf8"))
                    : {};
            (content as any)[k] = item;
            FileSystem.writeFileSync(_.path().toString(), JSON.stringify(content, null, 4), "utf8");
            return TsResult.Ok<typeof _>(_);
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function get<Item>(k: string): TsResult.Result<Item, unknown> {
        try {
            if (!_exists()) {
                return TsResult.Err<string>("PathNotFound");
            }
            return TsResult.Ok<Item>(JSON.parse(_.content().unwrap().toString("utf8"))?.[k]);
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    function _exists(): boolean {
        return _.path().exists().unwrapOr(false);
    }
}