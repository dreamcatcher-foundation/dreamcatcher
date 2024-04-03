import {on, off} from "./Remote.tsx";
import RemoteCol from "./RemoteCol.tsx";
import React, {useEffect, useState} from "react";

export interface IRemotePageProps {
    initialPages: number;
}

export default function RemotePage(props: IRemotePageProps) {
    const initialPages = props.initialPages;
    const initialPagesValue = `${initialPages * 100}vh`;
    const [pagesValue, setPagesValue] = useState(initialPagesValue);
    useEffect(function() {
        function changePagesValue(input: number) {
            const value = `${input * 100}vh`;
            setPagesValue(value);
        }

        on("page setPages", changePagesValue);
        return function() {
            off("page setPages");
        }
    }, []);
    return (
        <RemoteCol name={"page"} width={"100vw"} height={pagesValue}/>
    );
}