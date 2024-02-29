import {compile} from "solc";
import Web3 from "web3";
import {resolve, extname} from "path";
import {
    readFileSync, 
    writeFileSync,
    readdirSync,
    existsSync
} from "fs";
import {glob} from "glob";

const solidstateDirPath: string = "./code/contracts/sol/source/solidstate";
const extension: string = ".sol";

async function paths(directory: string, extension?: string): Promise<string[]> {
    if (!existsSync(directory)) {
        throw new Error("unable to find directory");
    }
    let files: string[] = [];
    const entries = readdirSync(directory, {
        withFileTypes: true
    });
    for (const entry of entries) {
        const entryPath: string = resolve(directory, entry.name);
        if (entry.isDirectory()) {
            const subFiles = await paths(entryPath);
            files = [...files, ...subFiles];
        } else {
            files.push(entryPath);
        }
    }
    if (extension) {
        return files.filter(path => extname(path) === extension);
    }
    return files;
}

async function compiled(files: string[]) {
    const contents: any[] = [];
    for (const file of files) {
        if (!existsSync(file)) {
            throw new Error("file does not exist");
        }
        const content: any = JSON.parse(compile(JSON.stringify({
            language: "Solidity",
            sources: {
                filename: {
                    content: readFileSync(file, "utf8")
                }
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"]
                    }
                }
            }
        })));
        contents.push([

        ]);
    }
}

async function main() {
    //console.log(existsSync(solidstateDirPath));
    const re = await paths(solidstateDirPath, extension);
    const content: any = await JSON.parse(compile(JSON.stringify({
        language: "Solidity",
        sources: {
            filename: {
                content: readFileSync(re[4], "utf8")
            }
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"]
                }
            }
        }
    })));
    console.log(content);
}

main();


