import {render} from "./Boilerplate.tsx";
import {createBrowserRouter} from "react-router-dom";
import {HomePage} from "./page/HomePage.tsx";

render(createBrowserRouter([{
    path: "/code/frontend/AtlasClient/Index.html",
    element: <HomePage/>
}]));