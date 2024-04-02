import SteelText, {type ISteelTextProps} from "./SteelText.tsx";

export interface ISteelTextHeadingProps extends ISteelTextProps {}

export default function SteelTextHeading(props: ISteelTextHeadingProps) {
    return (
        <SteelText text={props.text} style={{...{fontSize: "40px"}, ...props.style}}/>
    );
}