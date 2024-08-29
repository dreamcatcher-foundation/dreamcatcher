import type { ActionRejectedError as EthersActionRejectedError } from "ethers";
import type { BadDataError as EthersBadDataError } from "ethers";
import type { BufferOverrunError as EthersBufferOverrunError } from "ethers";
import type { CallExceptionError as EthersCallExceptionError } from "ethers";
import type { CancelledError as EthersCancelledError } from "ethers";
import type { InsufficientFundsError as EthersInsufficientFundsError } from "ethers";
import type { MissingArgumentError as EthersMissingArgumentError } from "ethers";
import type { NetworkError as EthersNetworkError } from "ethers";
import type { NonceExpiredError as EthersNonceExpiredError } from "ethers";
import type { NotImplementedError as EthersNotImplementedError } from "ethers";
import type { NumericFaultError as EthersNumericFaultError } from "ethers";
import type { OffchainFaultError as EthersOffchainFaultError } from "ethers";
import type { ReplacementUnderpricedError as EthersReplacementUnderpriceError } from "ethers";
import type { ServerError as EthersServerError } from "ethers";
import type { TimeoutError as EthersTimeoutError } from "ethers";
import type { TransactionReplacedError as EthersTransactionReplacedError } from "ethers";
import type { UnconfiguredNameError as EthersUnconfiguredNameError } from "ethers";
import type { UnexpectedArgumentError as EthersUnexpectedArgumentError } from "ethers";
import type { UnsupportedOperationError as EthersUnsupportedOperationError } from "ethers";
import type { UnknownError as EthersUnknownError } from "ethers";
import type { InvalidArgumentError as EthersInvalidArgumentError } from "ethers";
import type { EthersError } from "ethers";
import type { ErrorCode as EthersErrorCode } from "ethers";

export type ParsedEthersError
    =
    | EthersUnknownError
    | EthersNotImplementedError
    | EthersUnsupportedOperationError
    | EthersNetworkError
    | EthersServerError
    | EthersTimeoutError
    | EthersBadDataError
    | EthersCancelledError
    | EthersBufferOverrunError
    | EthersNumericFaultError
    | EthersInvalidArgumentError
    | EthersMissingArgumentError
    | EthersUnexpectedArgumentError
    | EthersCallExceptionError
    | EthersInsufficientFundsError
    | EthersNonceExpiredError
    | EthersReplacementUnderpriceError
    | EthersTransactionReplacedError
    | EthersUnconfiguredNameError
    | EthersOffchainFaultError
    | EthersActionRejectedError;

export type EthersErrorTask<TaskReturn = unknown> = (e: ParsedEthersError) => TaskReturn;

export function ifEthersError<ErrorCode extends EthersErrorCode, TaskReturn = unknown>(item: unknown, code: ErrorCode, task: EthersErrorTask<TaskReturn>):
    | TaskReturn
    | null {
    if (isEthersError<ErrorCode>(item, code)) return task(item as EthersError<ErrorCode>);
    return null;
}

export function isEthersError<ErrorCode extends EthersErrorCode>(item: unknown, code: ErrorCode): item is EthersError<ErrorCode> {
    if (!item || typeof item !== "object") return false;
    if (!("code" in (item as any)) || !("shortMessage" in (item as any))) return false;
    let e = item as EthersError;
    if (e.code !== code) return false;
    return true;
}

export type { EthersActionRejectedError };
export type { EthersBadDataError };
export type { EthersBufferOverrunError };
export type { EthersCallExceptionError };
export type { EthersCancelledError };
export type { EthersInsufficientFundsError };
export type { EthersMissingArgumentError };
export type { EthersNetworkError };
export type { EthersNotImplementedError };
export type { EthersNumericFaultError };
export type { EthersOffchainFaultError };
export type { EthersReplacementUnderpriceError };
export type { EthersServerError };
export type { EthersTimeoutError };
export type { EthersTransactionReplacedError };
export type { EthersUnconfiguredNameError };
export type { EthersUnexpectedArgumentError };
export type { EthersUnsupportedOperationError };
export type { EthersUnknownError };
export type { EthersInvalidArgumentError };
export type { EthersError };
export type { EthersErrorCode };