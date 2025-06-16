// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Domain
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";
import { Id } from "../../../domain/aggregate/value-objects";

export class CompleteOrder {
    async execute(id: string): Promise<void> {
        try {
            // Instance order repository and save order
            const repository = new OrderRepository();

            // Get aggregate from repository
            const order: OrderAggregate | null = await repository.findById(new Id(id));

            // Ensure order exists
            if (!order) {
                throw new Error('Order not found to complete');
            }

            // Complete order and save it
            const updatedOrder: OrderAggregate = OrderAggregate.complete(order);
            await repository.update(updatedOrder);
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}