import {render} from "./boilerplate/Boilerplate.tsx";
import {createBrowserRouter} from "react-router-dom";
import {stream} from "./core/Stream.tsx";
import RemoteContainer from "./component/design/remote/RemoteContainer.tsx";
import RemoteShapeShifter from "./component/design/remote/RemoteShapeShifter.tsx";
import BlurDot from "./component/design/animation/BlurDot.tsx";

render(createBrowserRouter([{
    path: "/",
    element: <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        overflow: "hidden",
        background: "#161616"
    }}>
        <BlurDot width={"1000px"} height={"1000px"} color0={"#0652FE"} color1={"#161616"}/>
    </div>
}]));

