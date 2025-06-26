import {OrderLine} from "../../order/domain/value-object/order-line";
import {Id} from "../../order/domain/value-object/id";
import {PositiveNumber} from "../../order/domain/value-object/positive-number";
import {Address} from "../../order/domain/value-object/address";
import {Order, PersistOrderModel} from "../../order/domain/aggregate/order";
import {OrderRepository} from "../../order/domain/repository/repository";
import {OrderModel} from "../../models/orderModel";
import mongoose from "mongoose";

class OrderMongoRepository implements OrderRepository {
    async findById(id: Id): Promise<Order | null> {
        const order: PersistOrderModel | null = await OrderModel.findById(id.value);
        if (!order) {
            return null;
        }
        return Order.toDomain(order);
    }

    async findAll(): Promise<Order[] | []> {
        return [];
    }

    async save(order: Order): Promise<void> {
        const persistenceModel = order.toPersistence();
        const mongoOrder = new OrderModel({...persistenceModel});
        await mongoOrder.save();
    }

    async delete(id: Id): Promise<void> {}
}

describe('Order repository methods', () => {

    beforeAll(async () => {
        const DATABASE_CONNECTION_STRING = 'mongodb://localhost:27017/db_orders_repository_test';
        await mongoose.connect(DATABASE_CONNECTION_STRING);
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
       const repository = new OrderMongoRepository();
       //Act
       await repository.save(order);
       //Assert
       const savedOrder: Order | null = await repository.findById(order.id);
       expect(savedOrder?.toPersistence()).toEqual(order.toPersistence());
    });
});