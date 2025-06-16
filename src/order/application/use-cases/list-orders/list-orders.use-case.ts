// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Domain
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";

export class ListOrders {
    async execute() {
        try {
            // Instance order repository and save order
            const repository = new OrderRepository();

            // Get aggregates from repository
            const orders: OrderAggregate[] = await repository.findAll();

            // Map to API dto and return orders
            return orders.map((order: OrderAggregate) => OrderAggregate.toApi(order));
        } catch (e) {
            return e;
        }
    }
}