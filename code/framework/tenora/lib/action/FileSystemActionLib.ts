import * as FileSystem from "fs";
import * as Path from "path";

export function read(path: string): string {
    return FileSystem.readFileSync(path, "utf8");
}

export function write(path: string, content: string) {
    return FileSystem.writeFileSync(path, content);
}

export function lookfor(dir: string, name: string, extension: string): string | undefined | Error {
    let fPathResponse: string | undefined | Error;
    try {
        const contents: string[] = FileSystem.readdirSync(dir);
        for (let i = 0; i < contents.length; i++) {
            const fPath: string = Path.join(dir, contents[i]);
            const stat = FileSystem.statSync(fPath);
            if (stat.isDirectory()) {
                fPathResponse = lookfor(fPath, name, extension);
                if (typeof fPathResponse === "string") {
                    return fPathResponse;
                }
            } else if (contents[i].startsWith(name) && contents[i].endsWith(`.${extension}`)) {
                fPathResponse = fPath;
            }
        }
        return fPathResponse;
    } catch (fault) {
        return new Error(fault);
    }
}