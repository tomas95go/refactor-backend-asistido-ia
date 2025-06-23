class PositiveNumber {
    private constructor(readonly value: number) {}

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new Error('Negative numbers are not allowed');
        }

        return new PositiveNumber(value);
    }
}

describe('Manage positive numbers', () => {
   it('Should create a positive number', () => {
       const positiveNumber = PositiveNumber.create(1);
       expect(positiveNumber.value).toBe(1);
   });

   it('Should prevent the creation of a negative number', () => {
       expect(() => PositiveNumber.create(-1)).toThrow('Negative numbers are not allowed');
   });

});