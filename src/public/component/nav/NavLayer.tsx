import { Nav } from "@component/Nav";
import { Layer } from "@component/Layer";
import React from "react";

export function NavLayer(): React.JSX.Element {
    return <>
        <Layer>
            <Nav/>
        </Layer>
    </>;
}