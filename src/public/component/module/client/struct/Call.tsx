export type Call
    = {
        to: string;
        methodSignature: string;
        methodName: string;
        methodArgs?: unknown[];
        gasPrice?: bigint;
        gasLimit?: bigint;
        value?: bigint;
        chainId?: bigint;
        confirmations?: bigint;
    };

export function Call(args: Call): Call {
    return args;
}