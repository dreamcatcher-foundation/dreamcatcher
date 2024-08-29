import type {ReactNode} from "react";
import type {NavBrandProps} from "@component/NavBrandProps";
import {FlexCol} from "@component/FlexCol";
import {Sprite} from "@component/Sprite";
import {StaticTypography} from "@component/StaticTypography";

export function NavBrand(props: NavBrandProps): ReactNode {
    let {... more} = props;
    return <>
        <FlexCol
        {... more}>
            <Sprite
            src="../../img/press-kit/Logo.png"
            style={{
                width: "25px",
                aspectRatio: "1/1"
            }}/>
            <StaticTypography
            content="Dreamcatcher"
            style={{
                fontWeight: "bold",
                fontFamily: "satoshiRegular",
                fontSize: "1.5em"
            }}/>
        </FlexCol>        
    </>;
}