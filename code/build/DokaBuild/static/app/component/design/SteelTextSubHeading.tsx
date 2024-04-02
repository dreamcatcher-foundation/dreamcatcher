import SteelText, {type ISteelTextProps} from "./SteelText.tsx";

export interface ISteelTextSubHeading extends ISteelTextProps {}

export default function SteelTextSubHeading(props: ISteelTextSubHeading) {
    return (
        <SteelText text={props.text} style={{...{fontSize: "20px"}, ...props.style}}/>
    );
}