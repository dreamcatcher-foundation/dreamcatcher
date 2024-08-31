import { HomePage } from "./component/styled/page/HomePage";
import {ExplorePage} from "./component/styled/page/ExplorePage";
import { render } from "./component/Render";
import React from "react";

render([{ 
    "path": "/", 
    "element": <HomePage/> 
}, {
    "path": "/explore",
    "element": <ExplorePage/>
}]);