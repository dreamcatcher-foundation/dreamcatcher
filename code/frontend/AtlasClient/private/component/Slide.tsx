export function Slide({zIndex, children}: {zIndex: string; children?: JSX.Element | (JSX.Element)[];}) {
    return (
        <div
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: zIndex
            }}>
            {children}
        </div>
    );
}