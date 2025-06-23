class PositiveNumber {
    constructor(readonly value: number) {
        if(value < 0) {
            throw new Error('Negative numbers are not allowed');
        }
    }
}

describe('Manage positive numbers', () => {
   it('Should create a positive number', () => {
       const positiveNumber = new PositiveNumber(1);
       expect(positiveNumber.value).toBe(1);
   });

   it('Should prevent the creation of a negative number', () => {
       expect(() => new PositiveNumber(-1)).toThrow('Negative numbers are not allowed');
   });

});