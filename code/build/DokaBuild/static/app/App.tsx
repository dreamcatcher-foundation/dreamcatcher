import {render} from "./boilerplate/Boilerplate.tsx";
import {createBrowserRouter, Link} from "react-router-dom";
import Window from "./component/design/Window.tsx";

render(createBrowserRouter([{
    path: "/",
    element: <div style={{width: "100vw", height: "100vh"}}>
        <Window name={"steve"} width={"25px"} height={"50px"} hasSteelFrameBorder={true}/>
    </div>
}]));