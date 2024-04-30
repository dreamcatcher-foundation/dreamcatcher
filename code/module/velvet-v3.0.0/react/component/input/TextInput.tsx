import type {ReactNode} from "react";
import type {RenderedRowProps} from "../rendered/RenderedRow.tsx";
import EventsHub from "../../../event/EventsHub.ts";
import RenderedRow from "../rendered/RenderedRow.tsx";
import UniqueTag from "../../../event/UniqueTag.ts";

export type TextInputProps = RenderedRowProps & {
    placeholder?: string;
};

export default function TextInput(props: TextInputProps): ReactNode {
    let {tag, placeholder, ...more} = props;
    tag = tag ?? new UniqueTag();
    return <RenderedRow {...{
        tag: tag,
        style: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            fontSize: "8px",
            color: "white"
        },
        ...more
    }}>
        <input {...{
            style: {
                width: "100%",
                height: "auto",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "#5B5B5B",
                background: "#161616",
                fontSize: "15px",
                fontFamily: "roboto mono",
                fontWeight: "bold",
                color: "white",
                padding: "12px",
                textShadow: "4px 4px 64px 8px #FFFFFF"
            },
            placeholder: placeholder,
            onChange: (event: any) => EventsHub.post(tag, "InputChange", event.target.value)
        }}>
        </input>
    </RenderedRow>;
}