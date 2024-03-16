import {INetwork} from "./INetwork.ts";

interface ILoaderPayload {
    solidityDirectory: string;
    flattenedContractsDirectory: string;
    networks: INetwork[];
    silence: boolean;
}