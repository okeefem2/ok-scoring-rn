export interface Sort<T> {
    sortProp: keyof T;
    asc: boolean;
}

// TODO tests
export function sort<T>(items: T[], { sortProp, asc }: Sort<T>): T[] {
    return items.sort((a, b) => {
        const aValue = a[sortProp];
        const bValue = b[sortProp];
        let sortDown; // Whether a should be set to a lower index than b
        if (!aValue || !bValue) {
            // If we are ascending, the undefined values should be pushed to the start of the array
            sortDown = asc ? !!bValue && !aValue : false;
        } else {
            // If we want ascending, the lower value should be pushed to the front of the array
            sortDown = asc ? aValue < bValue : aValue > bValue;
        }
        // if a should be sorted to a lower index than b, return -1 else 1
        return sortDown ? -1 : 1;
    });
}
