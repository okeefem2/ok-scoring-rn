/**
 * Given an array of values, swap the values at the given indexes
 * If there are no items at either index, do nothing
 * @param arr
 * @param i1
 * @param i2
 */
export function swap<T = any>(arr: T[], i1: number, i2: number) {
    if (!arr[i1] || !arr[i2]) {
        return arr;
    }
    const copy = [ ...arr ];
    [ copy[i1], copy[i2] ] = [ copy[i2], copy[i1] ]
    return copy;
}

/**
 * Converts an array of strings into a single comma separate string
 * If the number of values in the array exceed the max, truncate the exces and
 * add an ellipsis (...) to the string.
 * @param values
 * @param max
 */
export function commaSeperateWithEllipsis(values: string[], max = 5): string {
    if (values.length > max) {
        values = [ ...values.slice(0, max), `+${values.length - max}...` ];
    }
    return values.join(', ')
}

/**
 * Given an array of items that have a string key property, and a new item of the same type
 * add the new item if there is no existing item with the same key, otherwise replace the existing item
 * with the new one
 * @param arr
 * @param item
 */
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
