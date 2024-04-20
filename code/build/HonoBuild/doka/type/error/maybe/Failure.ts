export type Failure = ({
    success: false;
    reason?: string;
    error?: Error | undefined;
});