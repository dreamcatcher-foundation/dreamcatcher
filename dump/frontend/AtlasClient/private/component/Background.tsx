import {Slide} from "./Slide.tsx";

export function Background({children}: {children?: JSX.Element | (JSX.Element)[];}) {
    return (
        <Slide 
            zIndex={"1000"}>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#161616"
                }}>
                {children}
            </div>
        </Slide>
    );
}