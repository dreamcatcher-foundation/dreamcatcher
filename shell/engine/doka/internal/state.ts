import {JsonRpcProvider, Wallet} from "ethers";

export const runtime = (function() {
    let instance;
    let nameToNetwork: Map<string, >;

    return function() {
        if (!instance) {
            return instance = {};
        }
        return instance;
    }
})();