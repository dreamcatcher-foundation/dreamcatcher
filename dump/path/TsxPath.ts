import {Path, PathLike} from "../Path.ts";
import {execSync} from "child_process";

interface TsxPath extends Path {
    transpile: (outDirectoryPathLike?: PathLike) => TsxPath;
}

function TsxPath(_pathLike: PathLike): TsxPath {
    const instance: TsxPath = {
        ...Path(_pathLike),
        ...{
            transpile
        }
    };

    (function() {
        if (instance.extension() != "ts" && instance.extension() != "tsx") {
            throw new Error("INCOMPATIBLE_EXTENSION");
        }
    })();

    function transpile(outDirectoryPathLike?: PathLike): typeof instance {
        const path: string = outDirectoryPathLike?.toString() ?? "";
        if (!path) {
            if (!instance.directory()) {
                throw new Error("TsxPath: missing directory");
            }
            const command: string = `bun build ${instance.value()} --outdir ${instance.directory()!.value()}`;
            execSync(command);
            return instance;
        }
        const command: string = `bun build ${instance.value()} --outdir ${path}`;
        execSync(command);
        return instance;
    }

    return instance;
}

export {TsxPath, PathLike};