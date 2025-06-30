import {OrderRepository} from "../../domain/repository/repository";
import {Id} from "../../domain/value-object/id";
import {Order, OrderDto} from "../../domain/aggregate/order";
import {MongooseOrder, OrderSchema} from "../models/orderModel";
import mongoose from "mongoose";
import {Mongoose} from "mongoose";
import {OrderStatus} from "../../domain/constant/status";
import {DiscountCode} from "../../domain/constant/discount-code";

export type PersistOrderModel = {
    _id: string;
    items: { productId: string; quantity: number; price: number; }[];
    shippingAddress: string;
    status: OrderStatus,
    discountCode?: DiscountCode,
    total: number;
};

export class OrderMongoRepository implements OrderRepository {
    constructor(private mongoClient: Mongoose) {}

    static async create(dbUrl: string): Promise<OrderMongoRepository> {
        return new OrderMongoRepository(await mongoose.connect(dbUrl));
    }

    private mongooseModel() {
        return this.mongoClient.model<MongooseOrder>('Order', OrderSchema);
    }

    private toPersistence(dto: OrderDto): PersistOrderModel {
        return {
            _id: dto.id,
            items: dto.items.map(item => {
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                }
            }),
            shippingAddress: dto.shippingAddress,
            status: dto.status,
            discountCode: dto.discountCode,
            total: dto.total
        }
    }

    private fromPersistence(persistenceModel: PersistOrderModel): OrderDto {
        return {
            id: persistenceModel._id,
            items: persistenceModel.items.map(item => {
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                }
            }),
            shippingAddress: persistenceModel.shippingAddress,
            status: persistenceModel.status,
            discountCode: persistenceModel.discountCode,
            total: persistenceModel.total
        }
    }

    async findById(id: Id): Promise<Order | null> {
        const MongooseOrderModel = this.mongooseModel();
        const order: PersistOrderModel | null = await MongooseOrderModel.findById(id.value);
        if (!order) {
            return null;
        }
        return Order.toDomain(this.fromPersistence(order));
    }

    async findAll(): Promise<Order[] | []> {
        const MongooseOrderModel = this.mongooseModel();
        const persistedOrders: PersistOrderModel[] | [] = await MongooseOrderModel.find();
        return persistedOrders.map(persistedOrder => Order.toDomain(this.fromPersistence(persistedOrder)));
    }

    async save(order: Order): Promise<void> {
        const orderDto: OrderDto = order.toDto();
        const persistenceModel: PersistOrderModel = this.toPersistence(orderDto);
        await this.mongooseModel().findByIdAndUpdate({ _id: orderDto.id },{
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