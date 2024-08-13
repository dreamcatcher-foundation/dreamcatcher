import { Option } from "@lib/Result"
import { Some } from "@lib/Result";
import { None } from "@lib/Result";
import Axios from "axios";

export async function fetch(url: string): Promise<Option<unknown>> {
    try {
        return new Some<unknown>((await Axios.get(url)).data);
    }
    catch {
        return None;
    }
}

export async function post(url: string, data?: any): Promise<Option<unknown>> {
    try {
        return new Some<unknown>((await Axios.post(url, data)).data);
    }
    catch {
        return None;
    }
}