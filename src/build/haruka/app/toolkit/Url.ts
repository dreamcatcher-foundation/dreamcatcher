import type { AxiosResponse } from "@HarukaToolkitBundle";
import { Result } from "@HarukaToolkitBundle";
import { Err } from "@HarukaToolkitBundle";
import { Ok } from "@HarukaToolkitBundle";
import axios from "axios";

interface Url {
    toString(): string;
    response(): Promise<Result<AxiosResponse, unknown>>;
    post(item?: object): Promise<Result<AxiosResponse, unknown>>; 
}

function Url(string: string): Url {
    let self: Url = {
        toString,
        response,
        post
    };
    let _string: string = "";

    (function() {
        _string = string;
    })();

    function toString(): string {
        return _string;
    }

    async function response(): Promise<Result<AxiosResponse, unknown>> {
        try {
            return Ok<AxiosResponse>(await axios.get(toString()));
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }
    
    async function post(item?: object): Promise<Result<AxiosResponse, unknown>> {
        try {
            return Ok<AxiosResponse>(await axios.post(toString(), item));
        }
        catch (error: unknown) {
            return Err<unknown>(error);
        }
    }

    return self;
}

export { Url };