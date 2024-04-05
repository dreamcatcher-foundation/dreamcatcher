import {stream} from "../../../core/Stream.tsx";
import RemoteContainer from "./RemoteContainer.tsx";
import React, {useEffect} from "react";
export default function RemoteShapeShifter({tag, containers, ...more}: {tag: string; containers: ReturnType<typeof RemoteContainer>[]; [key: string]: any;}) {
    const state = (function() {
        let self;
        let _init = false;
        function init() {
            return _init;
        }
        function mark() {
            _init = true;
        }
        return self = self ?? {
            init,
            mark
        };
    })();
    useEffect(function() {
        const setStateEvent = `${tag} set state`;
        function handleSetStateEvent(to: number) {
            /// -> Based on the new state a new container is mounted and
            ///    the container in turn mounts its own children which can
            ///    have their own intro animations and logic. Ideally, this
            ///    will have logic behind it that stored various data from
            ///    multiple states.
            stream.swapBelow({tag: tag, item: containers[to]});
        }
        stream.subscribe({event: setStateEvent, task: handleSetStateEvent});
        if (!state.init()) {
            state.mark();
            stream.pushBelow({tag: tag, item: containers[0]});
        }
        function cleanup() {
            stream.wipe({event: setStateEvent});
        }
        return cleanup;
    }, []);
    return <RemoteContainer tag={tag} {...more}/>;
}