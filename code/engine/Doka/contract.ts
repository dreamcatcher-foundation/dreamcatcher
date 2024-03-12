import { exec } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import * as solc from 'solc';

export function Contract(path: string, outDirFlat: string, outDirABI: string, outDirBytecode: string, outDirSelectors: string) {
    const name = (function() {
        let instance: string | undefined;
        return function() {
            if (!instance) {
                return instance = path
                    .split('/')
                    .at(-1)
                    ?.split('.')
                    .at(0);
            }
            return instance;
        }
    })();

    if (!name()) {
        throw new Error('Doka: failed to parse contract name');
    }

    const pathToFlattenedSourceCode: string = `${outDirFlat}/${name()!}.sol`

    exec(`bun hardhat flatten ${path} > ${pathToFlattenedSourceCode}`);

    function waitFor10Seconds() {
        let ms = 10 * 1000;
        let st = new Date().getTime();
        while(new Date().getTime() < st + ms);
    }

    waitFor10Seconds();

    const sourceCode: string = readFileSync(pathToFlattenedSourceCode, 'utf-8');

    const options = {
        'language': 'Solidity',
        'sources': {
            [name()!]: {
                'content': sourceCode
            }
        },
        'settings': {
            'outputSelection': {
                '*': {
                    '*': [
                        'abi',
                        'evm.bytecode',
                        'evm.methodIdentifiers'
                    ]
                }
            }
        }
    } as const;

    const compiled = JSON.parse(solc.compile(JSON.stringify(options)));

    function abi() {
        return compiled['contracts'][name()!][name()!]['abi'];
    }

    function bytecode() {
        return compiled['contracts'][name()!][name()!]['evm']['bytecode']['object'];
    }

    function selectors() {
        return compiled['contracts'][name()!][name()!]['evm']['methodIdentifiers'];
    }

    function errorsAndWarnings(): object | 'Doka: no errors or warnings' {
        if (compiled['errors']) {
            return compiled['errors'];
        }
        return 'Doka: no errors or warnings';
    }

    writeFileSync(`${outDirABI}/${name()!}.json`, JSON.stringify(abi()));
    writeFileSync(`${outDirBytecode}/${name()!}.json`, JSON.stringify(bytecode()));
    writeFileSync(`${outDirSelectors}/${name()!}.json`, JSON.stringify(selectors()));

    return {
        name,
        abi,
        bytecode,
        selectors,
        errorsAndWarnings
    };
}