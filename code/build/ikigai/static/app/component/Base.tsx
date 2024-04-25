import type {CSSProperties} from "react";
import React from "react";

type IColProps = ({
    style?: CSSProperties;
    [k: string]: any;
});

export function Col(props: IColProps) {
    let {style, ...more} = props;

    let args = ({
        style: ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...style ?? ({})
        }),
        ...more
    }) as const;

    return (<div {...args}></div>);
}

export function Row(props: IColProps) {
    let {style, ...more} = props;

    let args = ({
        style: ({
            flexDirection: "row",
            ...style ?? ({})
        }),
        ...more
    }) as const;

    return (<Col {...args}></Col>);
}

export function Layer(props: IColProps) {
    let {style, ...more} = props;

    let args = ({
        style: ({
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            ...style ?? ({})
        }),
        ...more
    }) as const;

    return (<Col {...args}></Col>);
}

export function Page(props: IColProps) {
    let {style, ...more} = props;

    let args = ({
        style: ({
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "#161616",
            ...style ?? ({})
        }),
        ...more
    }) as const;

    return (<Col {...args}></Col>);
}