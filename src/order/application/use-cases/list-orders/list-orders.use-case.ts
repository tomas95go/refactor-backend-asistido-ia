// Domain
import { OrderDomainService } from "../../../domain/service/order.domain-service";
import { OrderAggregate } from "../../../domain/aggregate/order.aggregate";

export class ListOrders {
    async execute() {
        try {
            // Get aggregates from repository
            const orders: OrderAggregate[] = await new OrderDomainService().findAll();

            // Map to API dto and return orders
            return orders.map((order: OrderAggregate) => OrderAggregate.toApi(order));
        } catch (e) {
            return e;
        }
    }
}