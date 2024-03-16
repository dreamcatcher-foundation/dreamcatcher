type NumericCharacter = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type UppercaseHexadecimalLetterCharacter = "A" | "B" | "C" | "D" | "E" | "F";

type LowercaseHexadecimalLetterCharacter = "a" | "b" | "c" | "d" | "e" | "f";

type HexadecimalCharacter = UppercaseHexadecimalLetterCharacter | LowercaseHexadecimalLetterCharacter | NumericCharacter;

type UppercaseNonHexadecimalLetterCharacter = "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

type LowercaseNonHexadecimalLetterCharacter = "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";

type SymbolCharacter = "+" | "#" | "[" | "]" | ";" | "_" | "-" | "@" | ":" | "*" | "$" | "{" | "}" | "'" | '"' | "/" | "£" | "=" | "%" | "<" | ">" | "^" | "?" | "(" | ")" | "." | "," | "~" | "\\" | "\n" | "\t";

type LetterCharacter = UppercaseHexadecimalLetterCharacter | UppercaseNonHexadecimalLetterCharacter | LowercaseHexadecimalLetterCharacter | LowercaseNonHexadecimalLetterCharacter;

type LetterOrNumberCharacter = LetterCharacter | NumericCharacter;

type LetterOrNumberOrSymbolCharacter = LetterOrNumberCharacter | SymbolCharacter;

type HttpUrl = `http://${string}`;

type HttpsUrl = `https://${string}`;

type Url = HttpUrl | HttpsUrl;


type TrustMeBro = any;


type solc = any;