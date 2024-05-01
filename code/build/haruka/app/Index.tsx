import Boilerplate from "./lib/react/Boilerplate.tsx";
import React from "react";
import HomePage from "./page/HomePage.tsx";

Boilerplate.render([{
    path: "/",
    element: (
        <HomePage></HomePage>
    )
}]);