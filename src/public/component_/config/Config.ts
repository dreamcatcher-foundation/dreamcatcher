import {Hex} from "@lib/Color";

export namespace ColorPalette {
    export let graphite: Hex = Hex("#2D2D2D").unwrap();
    export let softObsidian: Hex = Hex("#171717").unwrap();
    export let darkObsidian: Hex = Hex("#111111").unwrap();
    export let obsidian: Hex = Hex("#141414").unwrap();
    export let titanium: Hex = Hex("#D6D5D4").unwrap();
    export let teal: Hex = Hex("#00FFAB").unwrap();
    export let pink: Hex = Hex("#FF00FB").unwrap();
    export let blue: Hex = Hex("#0652FE").unwrap();
    export let red: Hex = Hex("#FF3200").unwrap();
    export let deepPurple: Hex = Hex("#615FFF").unwrap();
    export let deepPurpleGradient: Hex[] = [deepPurple, Hex("#9662FF").unwrap()];
    export let redToPinkGradient: Hex[] = [red, pink];
}

export namespace Text {
    export let fontSize: string = "";
    export let fontWeight: string = "";
    export let fontFamily: string = "";
    export let color: string = "";
}