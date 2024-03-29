import {on, broadcast} from "../connection/Connection.tsx";
import {network} from "../connection/Network.tsx";

export function includeMetamaskOperator() {
    on(network(), "metamask::connection::request", function() {
        const metamask = (window as any).ethereum;
        if (!metamask) {
            broadcast(network(), "metamask::connection::request::failed", "metamask is not installed on client");
            return;
        }
        try {
            let accounts: unknown[] | undefined;
            metamask
                .request({method: "eth_requestAccounts"})
                .then(function(accountsFound: unknown[]) {
                    accounts = accountsFound;
                });
            if (!accounts) {
                return "no accounts where found";
            }
            return accounts;
        }
        catch (error) {
            return error;
        }
    });
}