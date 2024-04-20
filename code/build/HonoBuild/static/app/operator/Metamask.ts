import {type Signer, type Network, BrowserProvider} from "ethers";
import {on, post, render} from "./Emitter.ts";
import {type EventSubscription} from "fbemitter";

export const metamask = (function() {
    let instance: ({
        provider: typeof provider;
        ethereum: typeof ethereum;
        connect: typeof connect;
    });
    let _provider: BrowserProvider | undefined;

    (function() {
        on({
            socket: "ConnectButton",
            message: "Click",
            handler: connect
        });
    })();

    function provider() {
        return _provider;
    }

    function ethereum() {
        return (window as any).ethereum;
    }

    function connect() {
        if (!ethereum()) render({
            socket: "ConnectButton",
            text: "Please Install Metamask"
        });

        _provider = new BrowserProvider(ethereum());
        return;
    }

    return function() {
        if (!instance) return instance = ({
            provider,
            ethereum,
            connect
        });

        return instance;
    }
})();