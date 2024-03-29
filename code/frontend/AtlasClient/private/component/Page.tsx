import {Slide} from "./Slide.tsx";

export function Page({children}: {children?: ReturnType<typeof Slide> | (ReturnType<typeof Slide>)[];}) {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
            {children}
        </div>
    );
}