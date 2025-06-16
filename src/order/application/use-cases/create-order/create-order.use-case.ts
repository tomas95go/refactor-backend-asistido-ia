// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Application
import { ICreateOrder } from "./create-order.dto";

// Domain
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";

export class CreateOrder {
    async execute(dto: ICreateOrder): Promise<void> {
        try {
            // Create new order
            const order: OrderAggregate = OrderAggregate.create(dto);

            // Instance order repository and save order
            const repository = new OrderRepository();
            await repository.save(order);
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}