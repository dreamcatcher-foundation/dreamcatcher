import { HomePage } from "./component/styled/page/HomePage";
import {ExplorePage} from "./component/styled/page/ExplorePage";
import {TokenomicsPage} from "./component/styled/page/TokenomicsPage";
import { render } from "./component/Render";
import React from "react";

render([{ 
    "path": "/", 
    "element": <HomePage/> 
}, {
    "path": "/explore",
    "element": <ExplorePage/>
}, {
    path: "/tokenomics",
    element: <TokenomicsPage/>
}]);