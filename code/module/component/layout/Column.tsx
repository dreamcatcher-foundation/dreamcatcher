import React from "react";
import {type BaseProps, Base} from "../Base.tsx";

class Column {
    public static Component(props: BaseProps) {
        const {style, ...more} = props;
        return (
            <Base.Component {...{
                style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    ...style ?? {}
                },
                ...more
            }}>
            </Base.Component>
        );
    }
}

export {Column};