import {OrderRepository} from "./order/domain/repository/repository";
import {OrderMongoRepository} from "./order/infrastructure/repository/repository";
import {OrderUseCase} from "./order/application/order";

export class Factory {
    private static OrderRepository: OrderRepository;

    static async getOrderRepository(): Promise<OrderRepository> {
        if(!this.OrderRepository) {
            const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
            this.OrderRepository = await OrderMongoRepository.create(DATABASE_CONNECTION_STRING as string);
        }
        return this.OrderRepository;
    }

    static async createOrderUseCase(): Promise<OrderUseCase> {
        return new OrderUseCase(await this.getOrderRepository());
    }
}