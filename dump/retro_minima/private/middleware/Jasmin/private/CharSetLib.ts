export type Char =
  "a" | "A" | "0"
  | "b" | "B" | "1"
  | "c" | "C" | "2"
  | "d" | "D" | "3"
  | "e" | "E" | "4"
  | "f" | "F" | "5"
  | "g" | "G" | "6"
  | "h" | "H" | "7"
  | "i" | "I" | "8"
  | "j" | "J" | "9"
  | "k" | "K"
  | "l" | "L"
  | "m" | "M"
  | "n" | "N"
  | "o" | "O"
  | "p" | "P"
  | "q" | "Q"
  | "r" | "R"
  | "s" | "S"
  | "t" | "T"
  | "u" | "U"
  | "V" | "V"
  | "w" | "W"
  | "x" | "X"
  | "y" | "y"
  | "z" | "Z" ;

export type HexChar =
  "a" | "A" | "0"
  | "b" | "B" | "1"
  | "c" | "C" | "2"
  | "d" | "D" | "3"
  | "e" | "E" | "4"
  | "f" | "F" | "5"
  | "6" | "7" | "8"
  | "9" ;

export type ExpandedChar = Char
  | "+" | "#" | "[" | ";" | "_"
  | "-" | "@" | "]" | ":"
  | "*" | "$" | "{" | "'"
  | "/" | "£" | "}" | '"'
  | "=" | "%" | "<" | "|"
  | "!" | "&" | ">" | "^"
  | "?" | "(" | "," | "`"
  | "#" | ")" | "." | "~"
  | "\\"
  | "\n"
  | "\t";

export type CharOrWhiteSpace = ExpandedChar | " ";

export type HexCharArray = HexChar[];