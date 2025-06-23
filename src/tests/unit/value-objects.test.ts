import {PositiveNumber} from "../../order/domain/value-object/positive-number";
import {Address} from "../../order/domain/value-object/address";

describe('Manage positive numbers', () => {
   it('Should create a positive number', () => {
       const positiveNumber = PositiveNumber.create(1);
       expect(positiveNumber.value).toBe(1);
   });

   it('Should prevent the creation of a negative number', () => {
       expect(() => PositiveNumber.create(-1)).toThrow('Negative numbers are not allowed');
   });

});

describe('Manage addresses', () => {
   it('Should create an address', () => {
       const address = Address.create('Avenida Siempreviva 100');
       expect(address.value).toBe('Avenida Siempreviva 100');
   });

   it('Should prevent the creation of an empty address', () => {
       expect(() => Address.create('')).toThrow('Address cannot be empty');
       expect(() => Address.create('  ')).toThrow('Address cannot be empty');
   });

});