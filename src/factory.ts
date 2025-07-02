import {OrderRepository} from "./order/domain/repository/repository";
import {OrderMongoRepository} from "./order/infrastructure/repository/mongo-repository";
import {OrderUseCase} from "./order/application/order";
import {OrderController} from "./order/infrastructure/controllers/orderController";
import {Client} from "node-mailjet";
import {Messenger} from "./order/domain/messenger/messenger";
import {MailjetMessenger} from "./order/infrastructure/messenger/messenger";

export class Factory {
    private static OrderRepository: OrderRepository;

    static async getOrderRepository(): Promise<OrderRepository> {
        if(!this.OrderRepository) {
            const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
            this.OrderRepository = await OrderMongoRepository.create(DATABASE_CONNECTION_STRING as string);
        }
        return this.OrderRepository;
    }

    static createOrderUseCase(repository: OrderRepository, messenger: Messenger): OrderUseCase {
        return new OrderUseCase(repository, messenger);
    }

    static createOrderController(useCase: OrderUseCase): OrderController {
        return new OrderController(useCase);
    }

    static createMailjetMessenger(): Messenger {
        const client: Client = new Client({
            apiKey: process.env.MJ_APIKEY_PUBLIC,
            apiSecret: process.env.MJ_APIKEY_PRIVATE
        });

        return MailjetMessenger.create(client);
    }
}