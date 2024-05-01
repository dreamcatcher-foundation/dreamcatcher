import React from "react";
import Boilerplate from "../code/module/velvet-v3.0.0/react/Boilerplate.tsx";
import Page from "../../../module/velvet-v3.0.0/react/component/base/Page.tsx";
import Layer from "../../../module/velvet-v3.0.0/react/component/base/Layer.tsx";

Boilerplate.render([{
    path: "/diamond",
    element: <Page {...{
        "children": [
            <Layer {...{

            }}/>
        ]
    }}/>
}])