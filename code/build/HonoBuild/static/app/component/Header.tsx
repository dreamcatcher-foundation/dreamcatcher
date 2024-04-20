import React from "react";
import {RenderedText, RenderedCol} from "./Rendered_.tsx";

export type IHeaderProps = ({});

export function Header(props: IHeaderProps) {
    const {} = props;

    const args = ({
        nodeId: "Header",
        w: "auto",
        h: "auto",
        initialStyle: ({
            alignItems: "start"
        })
    }) as const;

    const headingArgs = ({
        nodeId: "Heading",
        initialText: "Scaling Dreams, Crafting Possibilities",
        initialStyle: ({
            fontSize: "2em",
            background: "#615FFF"
        })
    }) as const;

    const subHeadingArgs = ({
        nodeId: "SubHeading",
        initialText: "Deploy ERC2535 tokenized vaults in seconds",
        initialStyle: ({
            fontSize: "1em"
        })
    }) as const;

    return (
        <RenderedCol {...args}>
            <RenderedText {...headingArgs}></RenderedText>
            <RenderedText {...subHeadingArgs}></RenderedText>
        </RenderedCol>
    );
}