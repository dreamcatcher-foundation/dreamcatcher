import { Nav } from "src/public/component_/nav/Nav";
import { Layer } from "@component/Layer";
import React from "react";

export function NavLayer(): React.JSX.Element {
    return <>
        <Layer>
            <Nav/>
        </Layer>
    </>;
}