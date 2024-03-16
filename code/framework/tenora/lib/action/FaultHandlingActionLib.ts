export function require(statement: boolean, message?: string): void {
    if (!statement) {
        throw new Error(message);
    }
}