import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";

export function render(router: unknown) {
    const root = document.getElementById("root")!;
    const reactDOMRoot = createRoot(root);
    reactDOMRoot.render(
        <StrictMode>
            <RouterProvider router={(router as any)}></RouterProvider>
        </StrictMode>
    );
}