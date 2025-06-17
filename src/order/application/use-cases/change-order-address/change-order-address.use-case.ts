// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Application
import { IChangeOrderAddress } from "./change-order-address.dto";

// Domain
import { OrderDomainService } from "../../../domain/service/order.domain-service";
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";

export class ChangeAddress {
    async execute(dto: IChangeOrderAddress): Promise<void> {
        try {
            // Get aggregate from domain service
            const order: OrderAggregate = await new OrderDomainService().findById(dto.id);

            // Complete order
            const updatedOrder: OrderAggregate = OrderAggregate.changeAddress(order, dto);

            // Instance order repository and update data
            await new OrderRepository().update(updatedOrder);
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}