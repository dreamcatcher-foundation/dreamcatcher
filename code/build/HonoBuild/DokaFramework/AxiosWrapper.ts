import type {AxiosResponse} from "axios";
import axios from "axios";

export async function get(url: string): Promise<AxiosResponse> {
    return axios.get(url);
}

export async function post(url: string, item?: unknown): Promise<AxiosResponse> {
    return axios.post(url, item);
}

export {AxiosResponse};