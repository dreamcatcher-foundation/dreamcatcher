import { HomePage } from "./component/styled/page/HomePage";
import { render } from "./component/Render";
import React from "react";

render([{ 
    path: "/", 
    element: <HomePage/> 
}]);