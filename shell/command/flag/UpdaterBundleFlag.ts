import * as FileSystem from "fs";
import * as Path from "path";

main();

function main(): void {
  UpdaterBundleFlagConstructor()
    .generateBundleForMods();
}

export function UpdaterBundleFlagConstructor() {
  let __source: string = "";
  let __shellPathFile: string = "Shell";
  const __instance = {
    dir,
    mods,
    source,
    shellFilePath,
    generateBundleForMods
  }

  function dir(): string {
    return __dirname;
  }
  
  function mods(): string[] {
    return FileSystem
    .readdirSync(dir())
    .filter(mod => {
      return FileSystem
        .statSync(Path.join(dir(), mod))
        .isDirectory();
    })
    .map(mod => {
      return Path.join(dir(), mod);
    }).slice();
  }

  function source(): string {
    return __source;
  }

  function shellFilePath(): string {
    return __shellPathFile;
  }

  function generateBundleForMods(): typeof __instance {
    for (let i = 0; i < mods().length; i++) {
      _addFirstLine(mods()[i]);
      _addSecondLine(mods()[i]);
    }
    _openBundledFile();
    return __instance;
  }

  function _addFirstLine(mod: string): typeof __instance {
    __source += `export * "./${mod}/${shellFilePath()}`;
    return __instance;
  }

  function _addSecondLine(mod: string): typeof __instance {
    __source += `export type * from "./${mod}/${shellFilePath()}`;
    return __instance;
  }

  function _openBundledFile(): typeof __instance {
    FileSystem.writeFileSync(`${dir()}/Bundled.ts`, source());
    return __instance;
  }

  return __instance;
}