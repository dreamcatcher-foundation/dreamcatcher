import * as FileSystem from "fs";
import * as ChildProcess from "child_process";

main();

function main(): void {
  UpdaterBuildFlagConstructor()
    .transpileTsxIndexFileToJsForReactApp();
}

export function UpdaterBuildFlagConstructor() {
  const __instance = {
    dir,
    path,
    bunBuildCommand,
    htmlAndTsxFilesArePresent,
    htmlFileIsPresent,
    tsxFileIsPresent,
    transpileTsxIndexFileToJsForReactApp
  }

  function dir(): string {
    return __dirname;
  }

  function path(): readonly [
    string,
    string
  ] {
    return [
      `${dir()}/Index.html`,
      `${dir()}/Index.tsx`
    ]
  }

  function bunBuildCommand(): string {
    return `bun build ${path()[1]} --outdir ${dir()}`;
  }

  function htmlAndTsxFilesArePresent(): boolean {
    return htmlFileIsPresent() && tsxFileIsPresent();
  }

  function htmlFileIsPresent(): boolean {
    return FileSystem.existsSync(path()[0]);
  }

  function tsxFileIsPresent(): boolean {
    return FileSystem.existsSync(path()[1]);
  }

  function transpileTsxIndexFileToJsForReactApp(): typeof __instance {
    if (htmlAndTsxFilesArePresent()) {
      _executeBunBuildCommand();
    }
    return __instance;
  }

  function _executeBunBuildCommand(): typeof __instance {
    ChildProcess.execSync(bunBuildCommand());
    return __instance;
  }

  return __instance;
}