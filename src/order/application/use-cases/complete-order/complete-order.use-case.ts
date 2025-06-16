// Infrastructure
import { OrderDocumentPersistenceEntity } from "../../../infrastructure/persistence/order.document-persistence";

export class CompleteOrder {
    async execute(id: string): Promise<void> {
        try {
            // Get order by id
            const order = await OrderDocumentPersistenceEntity.findById(id);

            // Ensure order exists
            if (!order) {
                throw new Error('Order not found to complete');
            }

            // Ensure status transition is valid. ToDo: Business logic should be on aggregate
            if (order.status !== 'CREATED') {
                throw new Error(`Cannot complete an order with status: ${order.status}`);
            }

            // Complete order and save it. ToDo: Business logic should be on aggregate
            order.status = 'COMPLETED';
            await order.save();
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}