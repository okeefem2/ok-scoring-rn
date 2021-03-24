import { addOrReplaceByKey, commaSeperateWithEllipsis, removeByKey, swap } from './array.util';

describe('commaSeperateWithEllipsis', () => {
    it('should return comma separate values if length < max', () => {
        const result = commaSeperateWithEllipsis([ 'a', 'b', 'c' ], 4);
        expect(result).toEqual('a, b, c');
    });

    it('should return comma separate values with an ellipsis if length > max', () => {
        const result = commaSeperateWithEllipsis([ 'a', 'b', 'c' , 'd', 'e'], 4);
        expect(result).toEqual('a, b, c, d, +1...');
    });
});

describe('swap', () => {

    it('should do nothing if either of the indexes do not exist in the array', () => {
        expect(swap([1, 2, 3], 4, 5)).toEqual([1, 2, 3]);
    });

    it('should swap the items at the given indexes', () => {
        expect(swap([1, 2, 3], 0, 2)).toEqual([3, 2, 1]);
    });
});

describe('removeByKey', () => {

    it('should do nothing if key is not found', () => {
        expect(removeByKey([{ key: '2' }, { key: '3' }], '1'))
            .toEqual([{ key: '2' }, { key: '3' }]);
    });

    it('should remove item if key exists', () => {
        expect(removeByKey([{ key: '2' }, { key: '3' }], '2'))
            .toEqual([{ key: '3' }]);
    });
});


describe('addOrReplaceByKey', () => {
    it('should add item if no matching key exists', () => {
        expect(addOrReplaceByKey(
            [{ key: '1' }],
            { key: '2'}
        )).toEqual([
            { key: '1' },
            { key: '2' },
        ]);
    });

    it('should replace item if matching key exists', () => {
        expect(addOrReplaceByKey(
            [{ key: '1' }, { key: '2' }],
            { key: '1', value: 10 },
        )).toEqual([
            { key: '1', value: 10 },
            { key: '2' },
        ]);
    });
});
