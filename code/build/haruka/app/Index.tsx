import Boilerplate from "./lib/react/Boilerplate.tsx";
import React from "react";
import Base from "./component/Base.tsx";
import {defaultMappedEventEmitter} from "./lib/messenger/DefaultMappedEventEmitter.ts";

Boilerplate.render([{
    path: "/",
    element: (
        <Base {...{
            name: "Test",
            spring: {
                width: "250px",
                height: "200px",
                background: "#000"
            },
            onMouseEnter: () => defaultMappedEventEmitter.post("Test", "setSpring", {width: "500px"})
        }}>
        </Base>
    )
}]);