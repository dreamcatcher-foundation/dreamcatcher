import type {Success} from "./Success.ts";
import type {Failure} from "./Failure.ts";

export type Maybe<Value> = Success<Value> | Failure;