import {PositiveNumber} from "../../order/domain/value-object/positive-number";
import {Address} from "../../order/domain/value-object/address";
import {Id} from "../../order/domain/value-object/id";
import {OrderLine} from "../../order/domain/value-object/order-line";
import {Order} from "../../order/domain/aggregate/order";
import {DiscountCode, DiscountCodes} from "../../order/domain/constant/discount-code";
import {OrderStatus} from "../../order/domain/constant/status";

describe('Manage order aggregate', () => {
    it('Should create an order aggregate without discount', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress);
        expect(order.items).toBe(items);
        expect(order.shippingAddress).toBe(shippingAddress);
        expect(order.status).toBe(OrderStatus.Created);
    });

    it('Should create an order aggregate with discount', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');
        const discountCode: DiscountCode = DiscountCodes.DISCOUNT20;

        const order: Order = Order.create(items, shippingAddress, discountCode);
        expect(order.items).toBe(items);
        expect(order.shippingAddress).toBe(shippingAddress);
        expect(order.discountCode).toBe(discountCode);
        expect(order.status).toBe(OrderStatus.Created);
    });

});