import type * as fsType from "fs";
import * as fs from "fs";
import * as path from "path";
import {exec} from "child_process";
console.log("Load: loading");
let dirPath: string = "./code";
let loaderFilePathArray: string[] = getLoaderFilePathArray({dir: dirPath});
console.log(`Load: files found: ${loaderFilePathArray}`);
executeLoaderFilePathArray();

function getLoaderFilePathArray({dir}: {dir?: string}): string[] {
  let loaderFilePathArray: string[] = [];
  try {
    let filePathArray: string[] = fs.readdirSync(dir ?? "./");
    for (let file of filePathArray) {
      let filePath: string = path.join(dir ?? "./", file);
      let stats: fsType.Stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        loaderFilePathArray = loaderFilePathArray.concat(getLoaderFilePathArray({dir: filePath}));}
      else if (stats.isFile() && path.basename(file) === "Loader.ts") {
        loaderFilePathArray.push(filePath);}}}
  catch (error) {
    console.error(`Load: error while searching for Loader.ts files in directory ${dir}: ${error}`);}
  return loaderFilePathArray;}

function executeLoaderFilePathArray(): void {
  for (let loaderFilePath of loaderFilePathArray) {
    let command = `bun run ${loaderFilePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Load: error executing command ${command}: ${error}`);
        return;}
      if (stdout) {
        console.log(`Load: command output for ${command}:`);
        console.log(stdout);}
      if (stderr) {
        console.error(`Load: command error for ${command}:`);
        console.error(stderr);}});}}