import React from "react";
import Boilerplate from "./lib/react/Boilerplate.tsx";
import HomePage from "./page/HomePage.tsx";
import GetStartedPage from "./page/GetStartedPage.tsx";

Boilerplate.render([{
    path: "/",
    element: <HomePage/>
}, {
    path: "/getStarted",
    element: <GetStartedPage/>
}]);