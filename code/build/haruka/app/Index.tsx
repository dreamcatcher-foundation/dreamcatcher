import React from "react";
import Boilerplate from "./library/react/Boilerplate.tsx";
import HomePage from "./page/homePage/HomePage.tsx";

Boilerplate.render([{
    path: "/",
    element: <HomePage/>
}]);