import Readline from "readline";

export interface Terminal {
    question(query: string, hook: (answer: string) => void): void;
    close(): void;
}

export function Terminal() {
    let _interface: Readline.Interface;
    /***/ {
        _interface = Readline.createInterface({input: process.stdin, output: process.stdout});
        return {question, close};
    }
    function question(query: string, hook: (answer: string) => void): void {
        _interface.question(query, hook);
        return;
    }
    function close(): void {
        _interface.close();
        return;
    }
}