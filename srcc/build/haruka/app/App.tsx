import { render } from "@HarukaToolkitBundle";
import React from "react";


//import HomePage from "./page/homePage/HomePage.tsx";
//import ExplorePage from "./page/explorePage/ExplorePage.tsx";

render([{
    path: "/",
    element: <div>HelloWorld</div>
}, {
    path: "/explore",
    element: <div></div>
}]);