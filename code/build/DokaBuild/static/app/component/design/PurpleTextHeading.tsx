import SteelTextHeading, {type ISteelTextHeadingProps} from "./SteelTextHeading.tsx";

export interface IPurpleTextHeadingProps extends ISteelTextHeadingProps {}

export default function PurpleTextHeading(props: IPurpleTextHeadingProps) {
    return (
        <SteelTextHeading text={props.text} style={{...{background: "#615FFF"}, ...props.style}}/>
    );
}