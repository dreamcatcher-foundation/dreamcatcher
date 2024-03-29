export function BlurDot({width, height, color0, color1, children}: {width: string; height: string; color0: string; color1: string; children?: JSX.Element | (JSX.Element)[];}) {
    return (
        <div
            style={{
                width: width,
                height: height,
                backgroundImage: `radial-gradient(closest-side, ${color0}, ${color1})`
            }}>
            {children}
        </div>
    );
}