import { Ok } from "@lib/Result";
import { Err } from "@lib/Result";
import { transpileReactApp } from "doka-tools";
import { join } from "path";
import Express from "express";

(async function() {
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

        .listen(3000);
})();