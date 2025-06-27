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
        expect(order.id).toBeDefined();
        expect(order.items).toBe(items);
        expect(order.toPersistence().shippingAddress).toBe(shippingAddress.value);
        //expect(order.status).toBe(OrderStatus.Created);
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
        expect(order.id).toBeDefined();
        expect(order.items).toBe(items);
        expect(order.toPersistence().shippingAddress).toBe(shippingAddress.value);
        expect(order.discountCode).toBe(discountCode);
        //expect(order.status).toBe(OrderStatus.Created);
    });

    it('Should calculate the order total without a discount', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress);
        expect(order.calculateTotal()).toEqual(PositiveNumber.create(200));
    });

    it('Should calculate the order total with a discount', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress, DiscountCodes.DISCOUNT20);
        expect(order.calculateTotal()).toEqual(PositiveNumber.create(160));
    });

    it('Should complete an order', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress, DiscountCodes.DISCOUNT20);

        order.complete();

        expect(order.isCompleted()).toBe(true);
    });

    it(`Should change the order's address`, () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress, DiscountCodes.DISCOUNT20);

        order.updateShippingAddress(Address.create('Ocean View 101'));

        expect(order.toPersistence().shippingAddress).toBe('Ocean View 101');
    });

    it('Should convert order domain model to persistence model', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress, DiscountCodes.DISCOUNT20);

        const orderPersistenceModel = order.toPersistence();

        expect(orderPersistenceModel).toStrictEqual({
            _id: Id.from(order.id.value).value,
            items: itemsPrimitives,
            shippingAddress: 'Avenida Siempreviva 100',
            status: OrderStatus.Created,
            discountCode: DiscountCodes.DISCOUNT20,
            total: order.calculateTotal().value
        });
    });

    it('Should convert a persistence model to domain model', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress, DiscountCodes.DISCOUNT20);

        const orderPersistenceModel = order.toPersistence();
        const orderDomainModel = Order.toDomain(orderPersistenceModel);

        expect(orderDomainModel.id.value).toEqual(orderPersistenceModel._id);
        expect(orderDomainModel.items.map(item => { return { productId: item.productId.value, quantity: item.quantity.value, price: item.price.value } })).toStrictEqual(orderPersistenceModel.items.map(item => { return { productId: item.productId, quantity: item.quantity, price: item.price } }));
        expect(orderDomainModel.toPersistence().shippingAddress).toEqual(orderPersistenceModel.shippingAddress);
        expect(orderDomainModel.discountCode).toEqual(orderPersistenceModel.discountCode);

    });

    it('Should prevent the creation of an order aggregate when no items are provided', () => {
        const items: OrderLine[] = [];
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        expect(() => Order.create(items, shippingAddress)).toThrow('The order must have at least one item');
    });

    it('Should prevent the completion of an order aggregate when it was already completed', () => {
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create('Avenida Siempreviva 100');

        const order: Order = Order.create(items, shippingAddress, DiscountCodes.DISCOUNT20);

        order.complete();

        expect(() => order.complete()).toThrow('Cannot complete an order with status: COMPLETED');
    });

});