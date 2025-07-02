import {PositiveNumber} from "../../order/domain/value-object/positive-number";
import {Address} from "../../order/domain/value-object/address";
import {Id} from "../../order/domain/value-object/id";
import {OrderLine} from "../../order/domain/value-object/order-line";

describe('Manage positive numbers', () => {
   it('Should create a positive number', () => {
       const positiveNumber: PositiveNumber = PositiveNumber.create(1);
       expect(positiveNumber.value).toBe(1);
   });

   it('Should multiply 2 positive numbers', () => {
       const positiveNumber1: PositiveNumber = PositiveNumber.create(1);
       const positiveNumber2: PositiveNumber = PositiveNumber.create(2);

       const result: PositiveNumber = positiveNumber1.multiply(positiveNumber2);

       expect(result).toEqual(PositiveNumber.create(2));
    });

   it('Should add 2 positive numbers', () => {
       const positiveNumber1: PositiveNumber = PositiveNumber.create(1);
       const positiveNumber2: PositiveNumber = PositiveNumber.create(2);

       const result: PositiveNumber = positiveNumber1.add(positiveNumber2);

       expect(result).toEqual(PositiveNumber.create(3));
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

describe('Manage ids', () => {
    it('Should create a unique Id', () => {
        const id1 = Id.create();
        const id2 = Id.create();
        expect(id1.value).not.toBe(id2.value);
    });

    it('Should return an Id from a primitive string', () => {
        const existingId = '5e601c7e-aca6-4fa8-94de-7c46aec6e252';
        const id = Id.from(existingId);
        expect(id.value).toBe(existingId);
    });
});

describe('Manage order lines', () => {
    it('Should create an order line', () => {
        const productId = '8259dff2-4bf5-41da-b9b4-010b76988b30';
        const price = 100;
        const quantity = 2;
        const total = 200;

        const orderLine: OrderLine = OrderLine.create(Id.from(productId), PositiveNumber.create(quantity), PositiveNumber.create(price));
        expect(orderLine.productId.value).toBe(productId);
        expect(orderLine.price.value).toBe(price);
        expect(orderLine.quantity.value).toBe(quantity);
        expect(orderLine.calculateSubTotal().value).toBe(total);
    });
})