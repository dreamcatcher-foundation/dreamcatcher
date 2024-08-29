export type ErrorCodeIsh
    =
    | string
    | number
    | bigint;

export type FaultOptions
    = {
        message?: string;
        content?: unknown;
    };

export type Fault<ErrorCode extends ErrorCodeIsh>
    = {
        code(): ErrorCode;
        items(): unknown[];
        stack():
            | string
            | null;
    };

export function Fault<ErrorCode extends ErrorCodeIsh>(_code: ErrorCode, ... _items: unknown[]): Fault<ErrorCode> {
    let _stack: string | undefined = new Error().stack;
    
    function code(): ErrorCode {
        return _code;
    }

    function items(): unknown[] {
        return _items;
    }

    function stack():
        | string
        | null {
        return _stack ? _stack : null;
    }

    return { code, items, stack };
}

export function ifFault<ErrorCode extends ErrorCodeIsh, TaskReturn = unknown>(item: unknown, code: ErrorCode, task: (... items: unknown[]) => TaskReturn):
    | TaskReturn
    | null {
    if (isFault<ErrorCode>(item, code)) return task(... item.items());
    return null;
}

export function isFault<ErrorCode extends ErrorCodeIsh>(item: unknown, code: ErrorCode): item is Fault<ErrorCode> {
    if (!_matchFaultProp(item)) return false;
    if (!_matchFaultPropType(item)) return false;
    if (!_match<ErrorCode>(item, code)) return false;
    return true;
}

function _matchFaultProp(item: unknown): boolean {
    let hasStackProp: boolean = "stack" in (item as any);
    let hasCodeProp: boolean = "code" in (item as any);
    return hasStackProp && hasCodeProp;
}

function _matchFaultPropType(item: unknown): boolean {
    let stackPropIsFunction: boolean = typeof (item as any).stack === "function";
    let codePropIsFunction: boolean = typeof (item as any).code === "function";
    return stackPropIsFunction && codePropIsFunction;
}

function _match<ErrorCode extends ErrorCodeIsh>(item: unknown, code: ErrorCode): boolean {
    let itemCode: ErrorCode = (item as Fault<ErrorCode>).code();
    switch (typeof code) {
        case "string":
        case "number":
        case "bigint": return code === (itemCode as ErrorCode);
        default: return false;
    }
}

export function require<ErrorCode extends ErrorCodeIsh>(condition: boolean, code: ErrorCode, ... items: unknown[]): void {
    if (!condition) throw Fault(code, ... items);
    return;
}