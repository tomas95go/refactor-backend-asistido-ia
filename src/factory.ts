import {OrderRepository} from "./order/domain/repository/repository";
import dotenv from "dotenv";
import {OrderMongoRepository} from "./order/infrastructure/repository/repository";

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export class Factory {
    private static OrderRepository: OrderRepository;

    static async getOrderRepository(): Promise<OrderRepository> {
        if(!this.OrderRepository) {
            const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
            this.OrderRepository = await OrderMongoRepository.create(DATABASE_CONNECTION_STRING as string);
        }
        return this.OrderRepository;
    }
}