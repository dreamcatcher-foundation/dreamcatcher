import SteelText, {type ISteelTextProps} from "./SteelText.tsx";

export interface ISteelTextParagraphHeadingProps extends ISteelTextProps {}

export default function SteelTextParagraphHeadingProps(props: ISteelTextParagraphHeadingProps) {
    return (
        <SteelText text={props.text} style={{...{fontSize: "12px"}, ...props.style}}/>
    );
}