import {render} from "./Boilerplate.tsx";
import {createBrowserRouter} from "react-router-dom";
import {HomePage} from "./page/HomePage.tsx";
import {includeMetamaskOperator} from "./operators/MetamaskOperator.tsx";
import {includeClockOperator} from "./operators/ClockOperator.tsx";

includeMetamaskOperator();
includeClockOperator();

render(createBrowserRouter([{
    path: "/code/frontend/AtlasClient/Index.html",
    element: <HomePage/>
}]));