import {render} from "./boilerplate/Boilerplate.tsx";
import {createBrowserRouter} from "react-router-dom";
import RemotePage from "./component/design/RemotePage.tsx"
import {broadcast} from "./component/design/Remote.tsx";
import RemoteContainer from "./component/design/remote/RemoteContainer.tsx";
import {stream} from "./core/Stream.tsx";

const style = {
    width: "100px",
    height: "10px"
};

//operator();
render(createBrowserRouter([{
    path: "/",
    element: <RemoteContainer tag={"test"} style={{width: "100px", height: "100px"}} delay={100} cooldown={100} direction={"column"}>
    </RemoteContainer>
}]));

