export type Deployment
    = 
    | {
        bytecode: string;
        gasPrice?: bigint;
        gasLimit?: bigint;
        value?: bigint;
        chainId?: bigint;
        confirmations?: bigint;
    }
    | {
        bytecode: string;
        abi: object[];
        args?: unknown[];
        gasPrice?: bigint;
        gasLimit?: bigint;
        value?: bigint;
        chainId?: bigint;
        confirmations?: bigint;
    };

export function Deployment(args: Deployment): Deployment {
    return args;
}