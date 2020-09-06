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

export function addOrReplaceByKey<T extends { key: string }>(arr: T[], item: T): T[] {
    const arrCopy = [ ...arr];
    const existingItemIndex = arrCopy.findIndex(i => i.key === item.key);
    if (existingItemIndex !== -1) {
        arrCopy.splice(existingItemIndex, 1, item);
    } else {
        arrCopy.push(item);
    }
    return arrCopy;
}
