import {OrderRepository} from "../../domain/repository/repository";
import {Id} from "../../domain/value-object/id";
import {Order, PersistOrderModel} from "../../domain/aggregate/order";
import {MongooseOrder, OrderSchema} from "../models/orderModel";
import mongoose from "mongoose";
import {Mongoose} from "mongoose";

export class OrderMongoRepository implements OrderRepository {
    constructor(private mongoClient: Mongoose) {}

    static async create(dbUrl: string): Promise<OrderMongoRepository> {
        return new OrderMongoRepository(await mongoose.connect(dbUrl));
    }

    private mongooseModel() {
        return this.mongoClient.model<MongooseOrder>('Order', OrderSchema);
    }

    async findById(id: Id): Promise<Order | null> {
        const MongooseOrderModel = this.mongooseModel();
        const order: PersistOrderModel | null = await MongooseOrderModel.findById(id.value);
        if (!order) {
            return null;
        }
        return Order.toDomain(order);
    }

    async findAll(): Promise<Order[] | []> {
        const MongooseOrderModel = this.mongooseModel();
        const persistedOrders: PersistOrderModel[] | [] = await MongooseOrderModel.find();
        return persistedOrders.map(persistedOrder => Order.toDomain(persistedOrder));
    }

    async save(order: Order): Promise<void> {
        const persistenceModel = order.toPersistence();
        await this.mongooseModel().findByIdAndUpdate({ _id: order.toPersistence()._id },{
            items: persistenceModel.items,
            shippingAddress: persistenceModel.shippingAddress,
            status: persistenceModel.status,
            discountCode: persistenceModel.discountCode,
            total: persistenceModel.total,
        }, { upsert: true });
    }

    async delete(id: Id): Promise<void> {
        const MongooseOrderModel = this.mongooseModel();
        await MongooseOrderModel.deleteOne({_id: id.value});
    }
}