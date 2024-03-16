import { execSync } from "child_process";
import * as FileSystem from "fs";
import * as Path from "path";
import { doka } from "../Doka/dokas";

const tenso = (function() {
    interface Tenso {
        timestamp: typeof timestamp;
        sleep: typeof sleep;
        execute: typeof execute;
        assert: typeof assert;
    }

    let instance: Tenso;

    function timestamp(): bigint {
        return BigInt(new Date().getTime());
    }

    function sleep(ms: bigint): void {
        while(timestamp() < timestamp() + ms);
    }

    function execute(command: string): Buffer {
        return execSync(command);
    }

    function assert(expression: boolean, message?: string): void {
        if (!expression) {
            throw new Error(message ?? "");
        }
    }

    return function() {
        if (!instance) {
            return instance = {
                timestamp,
                sleep,
                execute,
                assert
            }
        }
        return instance;
    }
})();

tenso().assert(3 + 2 == 3, "some message");


$if(!name, function() {

});

$if(2 + 2 == 2, function() {

});


const searchRequest: SearchRequest = {
    name: "",
    extension: ".sol",
    dir: ""
}


interface SearchRequest {
    dir: string;
    name: string;
    extension: string;
}

interface SearchResponse {
    searchRequest: SearchRequest;
    response:
        | string
        | undefined
        | Error;
}



function $lookfor(requests: ({dir: string, name: string, extension: string})[]) {
    
} {

}


$lookfor([{
    dir: "",
    name: "",
    extension: ""
}]);

function _lookfor(request: SearchRequest): SearchResponse {
    let fPathResponse: string | undefined;
    try {
        const contents = FileSystem.readFileSync(request.dir);
        
    }
}


function lookfor(dir: string, name: string, extension: string): string | undefined | Error {
    let responseFPath: string | undefined;
    return wrap(function() {
        let contents = FileSystem.readdirSync(dir);
        for (const file of contents) {
            let fPath = Path.join(dir, file);
            let stat = FileSystem.statSync(fPath);
            if (stat.isDirectory()) {
                responseFPath = lookfor(fPath, name, extension);
                if (responseFPath) {
                    return responseFPath;
                }
            } else if (file.startsWith(name) && file.endsWith(`.${extension}`)) {
                responseFPath = fPath;
            }
        }
        return responseFPath;
    });
}


function wrap(operation: Function, ...args: any[]) {
    try {
        return operation(...args);
    } catch (e) {
        return new e;
    }
}


lookfor("./", "", "").then(function() {

});






































const runtime = (function() {
    interface Self {
        attempt: typeof attempt
    }

    let __snapshot: Map<any, any> | undefined;
    let __storage: Map<any, any> = new Map();
    let __isLocked: boolean;
    let __instance: Self;

    function instance() {
        return __instance;
    }

    function attempt<R>(fn: (storage: Map<any, any>) => any): R | unknown {
        while(_isLocked()) {}
        _lock();
        _snap();
        try {
            return fn(_storage());
        } catch (error: unknown) {
            _rollback();
            return error;
        } finally {
            _unlock();
        }
    }

    function _snapshot(): Map<any, any> | undefined {
        return __snapshot;
    }

    function _snap(): boolean {
        __snapshot = new Map(_storage());
        return true;
    }

    function _rollback(): boolean {
        // snapshot cannot be undefined when rolling back because 
        // a snapshot is taken before the execution of this
        // rollback function.
        if (__snapshot) {
            __storage = new Map(_snapshot());
        }
        return true;
    }

    function _storage(): Map<any, any> {
        return __storage;
    }

    function _isLocked(): boolean {
        return __isLocked;
    }

    function _lock(): boolean {
        __isLocked = true;
        return true;
    }

    function _unlock(): boolean {
        __isLocked = false;
        return true;
    }

    return function() {
        if (!instance()) {
            return __instance = {
                attempt
            }
        }
        return instance();
    }
})();

function fn(operation: (storage: Map<any, any>) => any) {
    return function(...args: any[]) {
        return runtime().attempt(operation);
    };
}


const func = fn((storage) => {
    if (!storage.get("x")) {
        storage.set("x", 0);
    }
    storage.set("x", storage.get("x") + 5000);
    console.log(storage.get("x"));
});

const fault = fn((storage) => {
    storage.set("x", 60000);
    throw new Error("Something happened");
});


func();
func();
fault();
func();


function $v<T>(x: () => Readonly<T>): Readonly<T> {
    return x();
}

function $r() {}

function $(model: Function) {
    return (model())();
}





function $s(instance: any, model: object) {
    return function() {
        if (!instance) {
            return instance = model;
        }
        return instance;
    }
}

function $write() {}




$(() => {
    let instance;


    $point(instance, {
        
    });

    $s(instance, {

    });
})


function $point() {

}

function attempt(operation: Function, ...args: any[]) {

}


assert(3 + 4 == 2, "false math");


function assert(expression: boolean, message?: string | undefined): boolean {
    if (!expression) {
        throw new Error(message);
    }
    return true;
}


