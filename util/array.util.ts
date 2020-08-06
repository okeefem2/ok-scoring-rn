export function swap<T = any>(arr: T[], i1: number, i2: number) {
    const copy = [ ...arr ];
    [ copy[i1], copy[i2] ] = [ copy[i2], copy[i1] ]
    return copy;
}
