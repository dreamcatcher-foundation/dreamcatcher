import {stream} from "../../../core/Stream.tsx";
import React, {useState, useEffect} from "react";
import RemoteContainer from "./RemoteContainer.tsx";
export default function RemotePage({pages, ...more}: {pages?: bigint; [key: string]: any;}) {
    const [pagesValue, setPagesValue] = useState(`${Number(pages) * 100}vh`);
    useEffect(function() {
        const setPagesEvent = "page set pages";
        function changePagesValue(value: bigint) {
            return setPagesValue(`${Number(value) * 100}vh`);
        }
        stream.subscribe({event: setPagesEvent, task: changePagesValue});
        function cleanup() {
            stream.wipe({event: setPagesEvent});
        }
        return cleanup;
    }, []);
    return <RemoteContainer tag={"page"} style={{width: "100vw", height: pagesValue}} {...more}/>
}