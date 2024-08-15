export type RelativeUnit = string & { __type: "relativeUnit" };

export function RelativeUnit(number: number): RelativeUnit {
    return `${number}vw` as RelativeUnit;
}

export { RelativeUnit as U };