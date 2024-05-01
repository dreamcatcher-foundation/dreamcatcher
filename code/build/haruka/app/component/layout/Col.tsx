import Base, {type BaseProps} from "../Base.tsx";
import React, {type ReactNode} from "react";

export type ColProps = BaseProps;

export default function Col(props: ColProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Base {...{
            name: name,
            style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                ...style ?? {}
            },
            ...more
        }}>
        </Base>
    );
}