import Remote, {broadcast, type IRemoteProps} from "./Remote.tsx";

interface IWindowProps extends IRemoteProps {
    width: string;
    height: string;
    hasSteelFrameBorder?: boolean
}

export default function Window(props: IWindowProps) {
    const name = props.name;
    const hasSteelFrameBorder = props.hasSteelFrameBorder ?? false;
    const width = props.width;
    const height = props.height;
    const children = props.children;
    let initSpring = props.initSpring ?? {};
    let initStyle = props.initStyle ?? {};
    initStyle = {
        ...initStyle,
        background: "#171717",
        padding: "40px",
        overflowX: "hidden",
        overflowY: "scroll",
        minWidth: "256px",
        width: width,
        height: height
    };
    if (hasSteelFrameBorder) {
        initStyle = {
            ...initStyle,
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "linear-gradient(to bottom, transparent, #474647) 1"
        };
    }

    function onmouseenter() {
        const spring = {
            width: "400px"
        };
        broadcast(`${name} render spring`, spring);
    }

    function onmouseleave() {
        const spring = {
            
        };
        broadcast(`${name} render spring`, spring);
    }

    return (
        <div style={{width: "auto", height: "auto"}} onMouseEnter={onmouseenter} onMouseLeave={onmouseleave}>
            <Remote name={name} initSpring={initSpring} initStyle={initStyle}>
                {children}
            </Remote>
        </div>
    );
}