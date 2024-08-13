import { LandingPage } from "./component/page/landing/LandingPage";
import { render } from "./lib/react/Renderable";
import React from "react";

render([{
    path: "/",
    element: <LandingPage/>
}]);