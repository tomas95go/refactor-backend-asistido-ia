// Infrastructure
import { OrderRepository } from "../../../infrastructure/repository/order.repository";

// Domain
import { Id } from "../../../domain/aggregate/value-objects";


export class DeleteOrder {
    async execute(id: string): Promise<void> {
        try {
            // Instance order repository
            const repository = new OrderRepository();
            // Delete order by id
            await repository.deleteById(new Id(id));
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}