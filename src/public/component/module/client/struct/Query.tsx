export type Query
    = {
        to: string;
        methodSignature: string;
        methodName: string;
        methodArgs?: unknown[];
    };

export function Query(args: Query): Query {
    return args;
}