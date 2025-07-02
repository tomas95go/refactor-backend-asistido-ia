import {OrderRepository} from "./order/domain/repository/repository";
import {OrderMongoRepository} from "./order/infrastructure/repository/mongo-repository";
import {OrderUseCase} from "./order/application/order";
import {OrderController} from "./order/infrastructure/controllers/orderController";

export class Factory {
    private static OrderRepository: OrderRepository;

    static async getOrderRepository(): Promise<OrderRepository> {
        if(!this.OrderRepository) {
            const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
            this.OrderRepository = await OrderMongoRepository.create(DATABASE_CONNECTION_STRING as string);
        }
        return this.OrderRepository;
    }

    static createOrderUseCase(repository: OrderRepository): OrderUseCase {
        return new OrderUseCase(repository);
    }

    static createOrderController(useCase: OrderUseCase): OrderController {
        return new OrderController(useCase);
    }
}