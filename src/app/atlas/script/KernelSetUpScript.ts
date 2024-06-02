


abstract class iConstructorTransactionArgs {
    public readonly abstract address: string;
    public readonly abstract method: {
        readonly name: string;
        readonly args: unknown[];
    };
    public readonly abstract signature: string;
    public readonly abstract rpcUrl: string;
}

class ConstructorTransaction {
    public constructor(args: iConstructorTransactionArgs) {
        
    }
}


