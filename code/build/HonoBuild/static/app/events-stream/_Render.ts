import type {RenderArgs} from "./_RenderArgs.ts";
import {post} from "./_Post.ts";

function _ifHasPropRenderClassName(args: RenderArgs): void {
    const {toSocket, className} = args;

    if (className) post({
        toSocket: toSocket,
        message: "RenderClassNameRequest",
        data: className
    });
}

