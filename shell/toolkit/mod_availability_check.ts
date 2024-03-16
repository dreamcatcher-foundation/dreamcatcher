import type * as FileSystemType from "fs";
import * as FileSystem from "fs";
console.log("Shell: executing mod_availability_check");
main({dirPath: "./code/"})
  .then(function(response: "success"): void {
    console.log(`Shell: ${response}`);
  })
  .catch(function(response: unknown): void {
    console.log(`Shell: ${response}`);
  });
function main({dirPath}: {dirPath: string}): Promise<string[]> {
  return new Promise(function(resolve, reject): void {
    try {
      let modNames: string[] = FileSystem.readdirSync(dirPath, {withFileTypes: true})
        .filter(dirent => dirent.name)
        .map(dirent => dirent.name);
      for (let i = 0; i < modNames.length; i++) {
        let modName: string = modNames[i];
        console.log(`${modName}`);
      }
      resolve(modNames);
    }
    catch (error: unknown) {
      reject(error);
    }
  });
}