import {Wallet as EthersWallet} from "ethers";

export function Wallet() {
    let _inner: EthersWallet;
    let _key: string;
    const instance = ({
        useKey,
        useEnvVarKey
    });

    function address() {
        _inner.address;
    }

    function useKey(key: string) {
        _key = key;
        return instance;
    }

    function useEnvVarKey(envKey: string) {
        const key: string | undefined = process.env?.[envKey];

        if (!key) {
            throw new Error("Wallet: env key references undefined key");
        }

        _inner = new EthersWallet(key);
    }

    function build() {
        
    }

    return instance;
}

const w = Wallet()
    .useKey("")
    .useEnvVarKey("")