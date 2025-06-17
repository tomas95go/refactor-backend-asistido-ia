// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Domain
import { Id } from "../../../domain/aggregate/value-objects";


export class DeleteOrder {
    async execute(id: string): Promise<void> {
        try {
            // Instance order repository and delete order by id
            await new OrderRepository().deleteById(new Id(id));
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}