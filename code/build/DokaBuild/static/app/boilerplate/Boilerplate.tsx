import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";

export function render(router: unknown) {
    const root = document.getElementById("root")!;
    const rootReactDOM = createRoot(root);
    rootReactDOM.render(
        <StrictMode>
            <RouterProvider
            router={(router as any)}/>
        </StrictMode>
    );
}