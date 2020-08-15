export function swap<T = any>(arr: T[], i1: number, i2: number) {
    const copy = [ ...arr ];
    [ copy[i1], copy[i2] ] = [ copy[i2], copy[i1] ]
    return copy;
}

export function commaSeperateWithEllipsis(values: string[], max = 5): string {
    if (values.length > max) {
        values = [ ...values.slice(0, max), `+${values.length - max}...` ];
    }
    return values.join(', ')
}
