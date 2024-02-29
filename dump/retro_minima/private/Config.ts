import {type ColorHex, ColorHexConstructor} from "./middleware/Loaded.ts";

export namespace Color {
  export const TRANSPARENT: ColorHex ="transparent" as ColorHex;
  export const PURPLE = [
    ColorHexConstructor("5", "6", "0", "6", "F", "E"),
    ColorHexConstructor("4", "A", "4", "8", "C", "3")]
  export const WHITE: ColorHex = ColorHexConstructor("F", "F", "F", "F", "F", "F");
  export const RED: ColorHex = ColorHexConstructor("F", "F", "0", "0", "2", "4");
  export const PURPLE_VARIANT_A: ColorHex = ColorHexConstructor("5", "D", "3", "D", "9", "C");
  export const PURPLE_VARIANT_B: ColorHex = ColorHexConstructor("5", "6", "0", "6", "F", "E");
  export const BLUE_VARIANT_A: ColorHex = ColorHexConstructor("0", "6", "5", "2", "F", "E");
  export const OBSIDIAN: ColorHex = ColorHexConstructor("1", "6", "1", "6", "1", "6");
  export const BACKGROUND: ColorHex = ColorHexConstructor("1", "9", "1", "8", "1", "B");
  export const STEEL: ColorHex = ColorHexConstructor("9", "D", "9", "D", "9", "C");
  export const STEEL_VARIANT_A: ColorHex = ColorHexConstructor("4", "7", "4", "6", "4", "7");
  export const STEEL_VARIANT_B: ColorHex = ColorHexConstructor("C", "6", "C", "5", "C", "4");
  export const STEEL_VARIANT_C: ColorHex = ColorHexConstructor("8", "5", "8", "5", "8", "5");
  export const FLAT_STEEL_TEXT: ColorHex = ColorHexConstructor("D", "6", "D", "5", "D", "4");
  export const STEEL_OUTLINE: ColorHex =`linear-gradient(to bottom, ${STEEL_VARIANT_A}, ${TRANSPARENT})` as ColorHex;
  export const STEEL_SLAB: ColorHex =`linear-gradient(to bottom right, ${STEEL_VARIANT_B}, ${STEEL_VARIANT_C})` as ColorHex;
  export const INVERSE_STEEL_SLAB: ColorHex = `linear-gradient(to top, ${STEEL_VARIANT_B}, ${STEEL_VARIANT_C})` as ColorHex;
  export const LUXURY_PURPLE: ColorHex = `linear-gradient(to bottom, ${PURPLE[1]}, ${PURPLE_VARIANT_A})` as ColorHex;}