export type OnArgs = ({
    thisSocket: string;
    message: string;
    handler: ((data?: any) => any);
    once?: boolean;
});