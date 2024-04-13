import type {Signer, Network} from "ethers";
import {BrowserProvider} from "ethers";
import {on, post, render} from "../operator/Cargo.ts";

type IStorage = ({
    provider?: BrowserProvider;
});

let _storage: IStorage = ({});

export default function bootMetamaskOperator() {
    on({
        message: "GET_STORAGE",
        recipient: "METAMASK",
        handler: function() {
            return structuredClone(_storage);
        }
    });

    on({
        message: "CLICK",
        sender: "CONNECT_BUTTON",
        handler: async function() {
            let {ethereum} = window as any;

            if (!ethereum) {
                render({
                    recipient: "CONNECT_BUTTON",
                    text: "Please Install Metamask"
                });
            }

            _storage.provider = new BrowserProvider(ethereum);

            return;
        }
    });
}