import { ethers as Ethers } from "ethers";



type ITransaction = {
    "type": "";
    "signer": {
        "key": string;
    };
    "node": {
        "url": string;
    }
    "from": string;
    "to": string;
    "nonce": bigint;
    "gas": {
        "price":
            | bigint
            | "verySlow"
            | "slow"
            | "normal"
            | "fast";
        "limit": bigint;
    };
    "value": bigint;
    "data": string;
    "requiredChainId": bigint;
    "requiredConfirmations": bigint;
} | {
    "type": "constructor";
    "signer": {
        "key": string;
    };
    "node": {
        "url": string;
    };
    "from": string;
} | {
    "type": "query"
}


type Transaction = () => Promise<ITransaction>;
function Transaction(transaction: Transaction) {
    
}



Transaction(async function() {
    return {
        "type": "",
        "gas": {
            "price": "verySlow",
            "limit": 100000000n
        },
        "nonce": 50000n,
        
    }
})