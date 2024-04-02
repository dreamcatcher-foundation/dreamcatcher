import SteelText, {type ISteelTextProps} from "./SteelText.tsx";

export interface ISteelTextParagraphProps extends ISteelTextProps {}

export default function SteelTextParagraph(props: ISteelTextParagraphProps) {
    return (
        <SteelText text={props.text} style={props.style}/>
    );
}