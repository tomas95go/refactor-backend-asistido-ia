// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Domain
import { OrderDomainService } from "../../../domain/service/order.domain-service";
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";


export class ConfirmOrder {
    async execute(id: string): Promise<void> {
        try {
            // Get aggregate from domain service
            const order: OrderAggregate = await new OrderDomainService().findById(id);

            // Complete order
            const updatedOrder: OrderAggregate = OrderAggregate.confirm(order);

            // Instance order repository and update data
            await new OrderRepository().update(updatedOrder);
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}