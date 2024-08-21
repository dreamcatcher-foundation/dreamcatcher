import {animated} from "react-spring";

interface AProps {
    w: string;
    h: string;
    display: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
}

export function A(props: AProps) {
    return <>
        <animated.div>

        </animated.div>
    </>;
}

<A
    w = "500px"
    h = "500px"
    display = "flex"
    flexDirection = "row"
    justifyContent = "center"
    alignItems = "center"/>