import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {State} from "./State.tsx";

export function render(router: unknown) {
    const root = document.getElementById("root")!;
    const reactDOMRoot = createRoot(root);
    reactDOMRoot.render(
        <StrictMode>
            <State/>
            <RouterProvider router={(router as any)}></RouterProvider>
        </StrictMode>
    );
}