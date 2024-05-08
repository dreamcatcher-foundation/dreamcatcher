import SolidityPath from "../os/path/SolidityPath.ts";
import JavaScriptObjectNotationPath from "../os/path/JavaScriptObjectNotationPath.ts";

declare type AbstractBinaryInterface = 
    | object[]
    | string[]
    | string
    | SolidityPath
    | JavaScriptObjectNotationPath;