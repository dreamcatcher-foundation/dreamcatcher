import type { Sol } from "@lib/Solc";
import type { SolFailed } from "@lib/Solc";
import { Ok } from "@lib/Result";
import { Err } from "@lib/Result";
import { transpileReactApp } from "doka-tools";
import { join } from "path";
import { compile } from "@lib/Solc";
import Express from "express";

(async function() {
    /**
    let ownableTokenCompilation:
        | Sol
        | SolFailed 
        = compile(join(__dirname, "../contract/asset/token/ownable-token/OwnableToken.sol")).unwrap();
    let vaultCompilation:
        | Sol
        | SolFailed
        = compile(join(__dirname, "../contract/mock/prototype/vault/Vault.sol")).unwrap();
    if ("errors" in ownableTokenCompilation) {
        ownableTokenCompilation.errors.forEach(e => console.error(e));
        return;
    }
    if ("errors" in vaultCompilation) {
        vaultCompilation.errors.forEach(e => console.error(e));
        return;
    }
    */
    let transpilation:
        | Ok<Buffer>
        | Err<"tsxScriptNotFound">
        = transpileReactApp(join(__dirname, "App.tsx"), join(__dirname));
    if (transpilation.err) {
        console.error("could not find App.tsx");
        return;
    }
    let output: string = transpilation.unwrap().toString("utf8");
    console.log(output);
    Express()
        .use(Express.static(__dirname))
        .use(Express.json())
        
        .get("/", async (request, response) => response.status(200).sendFile(join(__dirname, "App.html")))
        /**
        .get("/data", async (request, response) => {
            
            response
                .status(200)
                .send({
                    ownableTokenBytecode: ownableTokenCompilation.bytecode,
                    ownableTokenAbi: ownableTokenCompilation.abi,
                    vaultBytecode: vaultCompilation.bytecode,
                    vaultTokenAbi: vaultCompilation.abi
                });
        })
        */
        .listen(3000);
})();