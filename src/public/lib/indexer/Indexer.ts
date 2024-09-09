import {JSDOM} from "jsdom";
import {writeFileSync} from "fs";
import {join} from "path";
import Axios from "axios";

let cooldown: bigint = 6000n;

async function get(url: string): Promise<unknown> {
    let content: unknown = (await Axios.get(url)).data;
    if (!content) throw Error("missing-content");
    return content;
}

function pageUrl(i: bigint): string {
    return `https://polygonscan.com/tokens?p=${Number(i)}`;
}

function wait(ms: bigint): void {
    let timestamp0: number = Date.now();
    let timestamp1: number = timestamp0;
    while (timestamp1 - timestamp0 < 3000) timestamp1 = Date.now();
    return;
}

async function getTokens(i: bigint): Promise<string[]> {
    let content: unknown = await get(pageUrl(i));
    if (typeof content !== "string") throw Error("type-error");
    let dom: JSDOM = new JSDOM(content);
    let doc: Document = dom.window.document;
    let tokens: string[] = [];
    let elements: NodeListOf<Element> = doc.querySelectorAll('td a[href*="/token/"]');
    for (let i = 0; i < elements.length; i++) {
        let href: string | null = elements[i].getAttribute("href");
        if (href) {
            let shards: string[] = href.split("/");
            let shard: string = shards[2];
            tokens.push(shard);
        }
    }
    return tokens;
}

(async (): Promise<void> => {
    let path: string = join(__dirname, "Tokens.json");
    let tokens: string[] = [];
    let pageNumber: bigint = 1n;
    while (pageNumber <= 18n) {
        let success: boolean = false;
        while (!success) {
            try  {
                tokens.push(... await getTokens(pageNumber));
                writeFileSync(path, JSON.stringify(tokens, null, 4), "utf-8");
                console.log(`tokens copied to ${path}`);
                success = true;
            }
            catch (e: unknown) {
                wait(cooldown);
            }
        }
        pageNumber += 1n;
    }
    return;
})();