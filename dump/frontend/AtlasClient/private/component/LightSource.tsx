export function LightSource({width, height, colorRGBA, zIndex, children}: {width: string, height: string, colorRGBA: string, zIndex: string, children?: JSX.Element | (JSX.Element)[]}) {
    return (
        <div
            style={{
                width: width,
                height: height,
                position: "absolute",
                zIndex: zIndex,
                WebkitBoxShadow: `0px 0px 300px 0px ${colorRGBA}`,
                MozBoxShadow: `0px 0px 300px 0px ${colorRGBA}`,
                boxShadow: `0px 0px 300px 0px ${colorRGBA}`
            }}>
            {children}
        </div>
    );
}