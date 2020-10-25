import { commaSeperateWithEllipsis } from './array.util';

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
    it('should do nothing if no array', () => {
        
    });

    it('should do nothing if either of the indexes do not exist in the array', () => {

    });

    it('should swap the items at the given indexes', () => {

    });
});
