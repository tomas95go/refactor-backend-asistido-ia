// Infrastructure
import { OrderRepository } from "../../infrastructure/repository/order.repository";

// Domain
import { OrderAggregate } from "../aggregate/order.aggregate";
import { Id } from "../aggregate/value-objects";

export class OrderDomainService {
    async findById(id: string): Promise<OrderAggregate> {
        // Instance order repository and get aggregate from repository
        const order: OrderAggregate | null = await new OrderRepository().findById(new Id(id));

        // Ensure order exists
        if (!order) {
            throw new Error('Order not found');
        }

        // Retrieve aggregate
        return order;
    }

    async findAll(): Promise<OrderAggregate[] | []> {
        // Instance order repository and get all aggregates from repository
        return await new OrderRepository().findAll();
    }
}