import * as FileSystem from "fs";
import * as Path from "path";

class System {
    public static lookfor(dir: string, name: string, extension: string) {

    }
}

const system = (function() {
    let self: {
        lookfor: typeof lookfor
    };


    function lookfor(dir: string, name: string, extension: string): string | undefined {
        let result: string | undefined;
        const paths: string[] = FileSystem.readdirSync(dir);
        for (let i = 0; i < paths.length; i++) {
            const path: string = Path.join(dir, paths[i]);
            const stat = FileSystem.statSync(path);
            if (stat.isDirectory()) {
                result = lookfor(path, name, extension);
                if (result) return result;
            } else if (
                paths[i].startsWith(name) &&
                paths[i].endsWith(`.${extension}`)
            ) result = path;
        }
        return result;
    }

    return function() {
        if (!self) {
            return self = {
                lookfor
            }
        }
        return self;
    }
})();

system().lookfor("", "", "");