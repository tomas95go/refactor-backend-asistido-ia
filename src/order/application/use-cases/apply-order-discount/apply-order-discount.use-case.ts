// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Application
import { IApplyOrderDiscount } from "./apply-order-discount.dto";

// Domain
import { OrderDomainService } from "../../../domain/service/order.domain-service";
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";

export class ApplyDiscount {
    async execute(dto: IApplyOrderDiscount): Promise<void> {
        try {
            // Get aggregate from domain service
            const order: OrderAggregate = await new OrderDomainService().findById(dto.id);

            // Complete order
            const updatedOrder: OrderAggregate = OrderAggregate.applyDiscount(order, dto);

            // Instance order repository and update data
            await new OrderRepository().update(updatedOrder);
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}