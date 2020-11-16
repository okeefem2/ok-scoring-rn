import { abbreviate } from './abbreviateNumber';

describe('abbreviateNumber', () => {
    it('should return number as is if less than max', () => {
        const result = abbreviate(900, 999);
        expect(result).toEqual('900');
    });

    it('should return negative number as is if less than max', () => {
        const result = abbreviate(-900, 999);
        expect(result).toEqual('-900');
    });

    it('should return abbreviated number if greater than max and equal to a floor', () => {
        const result = abbreviate(1000, 999);
        expect(result).toEqual('1.00K');
    });

    it('should return abbreviated number if greater than max', () => {
        const result = abbreviate(123456, 999);
        expect(result).toEqual('123.46K');
    });

    it('should return negtive abbreviated number if greater than max', () => {
        const result = abbreviate(-8675309, 999);
        expect(result).toEqual('-8.68M');
    });
});
