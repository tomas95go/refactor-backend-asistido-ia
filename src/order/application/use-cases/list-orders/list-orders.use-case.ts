// Infrastructure
import { OrderDocumentPersistenceEntity } from "../../../infrastructure/persistence/order.document-persistence";

export class ListOrders {
    async execute() {
        try {
            return await OrderDocumentPersistenceEntity.find();
        } catch (e) {
            return e;
        }
    }
}