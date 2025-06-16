// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Application
import { IUpdateOrder } from "./update-order.dto";

// Domain
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";
import { Id } from "../../../domain/aggregate/value-objects";

export class UpdateOrder {
    async execute(dto: IUpdateOrder): Promise<void> {
        try {
            // Extract order properties
            const id = dto.id;

            // Instance order repository and save order
            const repository = new OrderRepository();

            // Get aggregate from repository
            const order: OrderAggregate | null = await repository.findById(new Id(id));

            // Ensure order exists
            if (!order) {
                throw new Error('Order not found');
            }

            // Update order and save it
            const updatedOrder: OrderAggregate = OrderAggregate.update(order, dto);
            await repository.update(updatedOrder);

        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}