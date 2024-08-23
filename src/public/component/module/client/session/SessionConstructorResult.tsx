import type {SessionConstructorErr} from "@component/SessionConstructorErr";
import type {Session} from "@component/Session";
import type {Ok} from "@lib/Result";

export type SessionConstructorResult
    =
    | Ok<Session>
    | SessionConstructorErr;