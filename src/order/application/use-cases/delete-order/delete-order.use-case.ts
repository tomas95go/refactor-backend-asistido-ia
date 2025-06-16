// Infrastructure
import { OrderDocumentPersistenceEntity } from "../../../infrastructure/persistence/order.document-persistence";

export class DeleteOrder {
    async execute(id: string): Promise<void> {
        try {
            // Get order by id
            await OrderDocumentPersistenceEntity.findByIdAndDelete(id);
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}