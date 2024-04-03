import {render} from "./boilerplate/Boilerplate.tsx";
import {createBrowserRouter} from "react-router-dom";
import RemotePage from "./component/design/RemotePage.tsx"
import {broadcast} from "./component/design/Remote.tsx";
import {operator} from "./component/Operator.tsx";

operator();
render(createBrowserRouter([{
    path: "/",
    element: <RemotePage initialPages={1}/>
}]));