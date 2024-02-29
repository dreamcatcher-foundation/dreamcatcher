export type TCascadingStyleSheetUnit = "cm" 
                                     | "mm" 
                                     | "Q " 
                                     | "in" 
                                     | "pc" 
                                     | "pt" 
                                     | "px";

export type TCascadingStyleSheetValue = {
  __brand: "CascadingStyleSheetValue";
}

export function CascadingStyleSheetValueConstructor({
  number,
  unit
}: {
  number: number,
  unit: TCascadingStyleSheetUnit
}): TCascadingStyleSheetValue {
  return `${number}${unit}` as unknown as TCascadingStyleSheetValue;
}

export function CascadingStyleSheetValuePromiseConstructor({
  number,
  unit
}: {
  number: number,
  unit: TCascadingStyleSheetUnit
}): Promise<TCascadingStyleSheetValue> {
  return new Promise(
    function(
      resolve: (
        value: TCascadingStyleSheetValue
             | PromiseLike<TCascadingStyleSheetValue>
      ) => void,
      reject: (reason?: any) => void
    ): void {
      try {
        resolve(`${number}${unit}` as unknown as TCascadingStyleSheetValue);
      } catch (error: unknown) {
        reject(error);
      }
    }
  )
}