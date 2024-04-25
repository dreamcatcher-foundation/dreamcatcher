export function SteelFrame({width, height, gradientDirection, children}: {width: string, height: string, gradientDirection: string, children?: JSX.Element | (JSX.Element)[]}) {
    return (
        <div
            style={{
                width: width,
                height: height,
                borderWidth: "1px",
                borderStyle: "solid",
                borderImage: `linear-gradient(${gradientDirection}, transparent, #505050) 1`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
            {children}
        </div>
    );
}