import { sort } from './sort';

describe('sort', () => {
    it('should sort boolean value in asc order', () => {
        expect(sort([{ sortVal: true }, { sortVal: false } ], { sortProp: 'sortVal', asc: true })).toEqual(
            [
                { sortVal: false },
                { sortVal: true },
            ]
        );

        expect(sort([{ sortVal: false }, { sortVal: true }], { sortProp: 'sortVal', asc: true })).toEqual(
            [
                { sortVal: false },
                { sortVal: true },
            ]
        );
    });

    it('should sort boolean value in desc order', () => {
        expect(sort([{ sortVal: true }, { sortVal: false }], { sortProp: 'sortVal', asc: false })).toEqual(
            [
                { sortVal: true },
                { sortVal: false }
            ]
        );

        expect(sort([{ sortVal: false }, { sortVal: true }], { sortProp: 'sortVal', asc: false })).toEqual(
            [
                { sortVal: true },
                { sortVal: false },
            ]
        );
    });
});
