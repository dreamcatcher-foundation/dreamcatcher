import { File } from "@atlas/shared/os/File.ts";
import { Path } from "@atlas/shared/os/Path.ts";

class HtmlFile extends File {
    public constructor(path: Path) {
        if (new File(path).extension().unwrapOr(undefined) !== "html") {
            super(path, true);
        }
        else {
            super(path, false);
        }
    }
}

export { HtmlFile };