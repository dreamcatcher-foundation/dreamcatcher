import {render} from "./boilerplate/Boilerplate.tsx";
import {createBrowserRouter, Link} from "react-router-dom";
import Window from "./component/design/Window.tsx";
import {broadcast} from "./component/design/Remote.tsx";
import React from "react";

render(createBrowserRouter([{
    path: "/",
    element: 
    <div style={{width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <Window name={"steve"} width={"500px"} height={"500px"}></Window>
    </div>
}]));