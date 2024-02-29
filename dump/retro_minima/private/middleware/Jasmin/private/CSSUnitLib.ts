export type Centimeters = `${string}cm`;

export type Milimeters = `${string}mm`;

export type QuarterMillimeters = `${string}Q`;

export type Inches = `${string}in`;

export type Picas = `${string}pc`;

export type Points = `${string}pt`;

export type Pixels = `${string}px`;

export type Unit = 
    Centimeters 
  | Milimeters 
  | QuarterMillimeters
  | Inches
  | Picas
  | Points
  | Pixels;  