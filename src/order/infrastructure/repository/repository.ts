import {OrderRepository} from "../../domain/repository/repository";
import {Id} from "../../domain/value-object/id";
import {Order, PersistOrderModel} from "../../domain/aggregate/order";
import {OrderModel} from "../models/orderModel";

export class OrderMongoRepository implements OrderRepository {
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

    async delete(id: Id): Promise<void> {
    }
}