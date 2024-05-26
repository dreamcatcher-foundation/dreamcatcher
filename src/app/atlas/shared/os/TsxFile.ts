import { Directory } from "@atlas/shared/os/Directory.ts";
import { File } from "@atlas/shared/os/File.ts";
import { Path } from "@atlas/shared/os/Path.ts";
import { Result } from "ts-results";
import { Ok } from "ts-results";
import { Err } from "ts-results";
import { execSync } from "child_process";

class TsxFile extends File {
    public constructor(path: Path) {
        if (new File(path).extension().unwrapOr(undefined) !== "tsx") {
            super(path, true);
        }
        else {
            super(path, false);
        }
    }

    public transpile(directory: Directory | undefined = undefined): Result<Buffer, unknown> {
        try {
            if (!directory) {
                if (this.directory().none) {
                    return new Err<string>("TsxFile: Unable to find parent directory.");
                }
                return new Ok<Buffer>(execSync(`bun build ${this.path().toString()} --outdir ${this.directory().unwrap().path().toString()}`));
            }
            return new Ok<Buffer>(execSync(`bun build ${this.path().toString()} --outdir ${directory.path().toString()}`));
        }
        catch (error: unknown) {
            return new Err<unknown>(error);
        }
    }
}

export { TsxFile };