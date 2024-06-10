import { type IPath } from "../IPath.ts";
import { type IHtmlFile } from "./IHtmlFile.ts";
import { File } from "./File.ts";
import { isValidExtension } from "./IFile.ts";
import * as TsResult from "ts-results";

export function HtmlFile(_path: IPath): TsResult.Result<IHtmlFile, unknown> {
    const _: IHtmlFile = { ...File(_path) };

    if (!isValidExtension(_, "html")) {
        return TsResult.Err<string>("InvalidExtension");
    }

    return TsResult.Ok<IHtmlFile>(_);
}