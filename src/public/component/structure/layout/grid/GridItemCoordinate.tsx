export type GridItemCoordinate
    = {
        x: bigint;
        y: bigint;
    };

export function GridItemCoordinate(args?: GridItemCoordinate): GridItemCoordinate {
    return args ?? 
    GridItemCoordinate({
        x: 1n,
        y: 1n
    });
}