import type { IFile } from "@honoToolkit/";
import type { IPath } from "@HarukaToolkitBundle";
import { File } from "@HarukaToolkitBundle";
import { Ok } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";

interface IHtmlFile extends IFile {}

function HtmlFile({path}: {path: IPath}): Result<IHtmlFile, unknown> {
    let self: IHtmlFile = {
        ...File({path: path})
    };

    if (self.extension().unwrapOr(undefined) !== "html") {
        return Err<string>("HtmlFile: Incompatible extension.");
    }
    
    return Ok<IHtmlFile>(self);
}

export type { IHtmlFile };
export { HtmlFile };