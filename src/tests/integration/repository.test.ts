import {OrderLine} from "../../order/domain/value-object/order-line";
import {Id} from "../../order/domain/value-object/id";
import {PositiveNumber} from "../../order/domain/value-object/positive-number";
import {Address} from "../../order/domain/value-object/address";
import {Order} from "../../order/domain/aggregate/order";
import mongoose from "mongoose";
import {OrderMongoRepository} from "../../order/infrastructure/repository/repository";

describe('Order repository methods', () => {
    let repository: OrderMongoRepository;

    beforeAll(async () => {
        const DATABASE_CONNECTION_STRING = 'mongodb://localhost:27017/db_orders_repository_test';
        repository = await OrderMongoRepository.create(DATABASE_CONNECTION_STRING);
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('Should save an order without discount', async () => {
       //Arrange
       const itemsPrimitives = [{
           productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
           price: 100,
           quantity: 2
       }];
       const addressPrimitive = 'Avenida Siempreviva 100';

       const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
       const shippingAddress: Address = Address.create(addressPrimitive);
       const order: Order = Order.create(items, shippingAddress);
       //Act
       await repository.save(order);
       //Assert
       const savedOrder: Order | null = await repository.findById(Id.from(order.toDto().id));
       expect(savedOrder?.toDto()).toEqual(order.toDto());
    });

    it('Should list all orders', async () => {
        //Arrange
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];
        const addressPrimitive = 'Avenida Siempreviva 100';

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create(addressPrimitive);
        const order: Order = Order.create(items, shippingAddress);
        //Act
        await repository.save(order);
        //Assert
        const savedOrders: Order[] | [] = await repository.findAll();
        expect(savedOrders).toHaveLength(1);
    });

    it('Should delete a previously saved order', async () => {
        //Arrange
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];
        const addressPrimitive = 'Avenida Siempreviva 100';
        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create(addressPrimitive);

        const order: Order = Order.create(items, shippingAddress);

        await repository.save(order);
        //Act
        await repository.delete(Id.from(order.toDto().id));
        //Assert
        const savedOrders: Order[] | [] = await repository.findAll();
        expect(savedOrders).toHaveLength(0);
    });

    it('Should update a previously saved order', async () => {
        //Arrange
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];
        const addressPrimitive = 'Avenida Siempreviva 100';
        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create(addressPrimitive);

        const order: Order = Order.create(items, shippingAddress);

        await repository.save(order);
        //Act
        order.updateShippingAddress(Address.create('Ocean View 101'))
        await repository.save(order);
        //Assert
        const savedOrders: Order[] | [] = await repository.findAll();
        const savedOrder: Order | null = await repository.findById(Id.from(order.toDto().id));
        expect(savedOrder?.toDto().shippingAddress).toEqual(order.toDto().shippingAddress);
    });
});