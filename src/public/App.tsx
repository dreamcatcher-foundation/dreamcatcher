import { LandingPage } from "./component/page/landing/LandingPage";
import { ExplorePage } from "./component/page/explore/ExplorePage";
import { render } from "./lib/react/Renderable";
import React from "react";

render([{
    path: "/",
    element: <LandingPage/>
}, {
    path: "/explore",
    element: <ExplorePage/>
}]);