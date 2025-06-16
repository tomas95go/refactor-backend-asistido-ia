// Infrastructure
import { OrderDocumentPersistenceEntity } from "../../../infrastructure/persistence/order.document-persistence";

// Application
import { ICreateOrder } from "./create-order.dto";


export class CreateOrder {
    async execute(dto: ICreateOrder): Promise<void> {
        try {
            // Extract order properties
            const items = dto.items;
            const discountCode = dto.discountCode;
            const shippingAddress = dto.shippingAddress;


            // Ensure order contains at least 1 item. ToDo: Business logic should be on aggregate
            if (!items || !Array.isArray(items) || items.length === 0) {
                throw new Error('The order must have at least one item');
            }

            // Calculate order total. ToDo: Business logic should be on aggregate
            let total = 0;
            for (const item of items) {
                total += (item.price || 0) * (item.quantity || 0);
            }

            // Apply discount. ToDo: Business logic should be on aggregate
            if (discountCode === 'DISCOUNT20') {
                total = total * 0.8;
            }

            // Place order
            const newOrder = new OrderDocumentPersistenceEntity({
                items,
                discountCode,
                shippingAddress,
                total,
            });

            // Save order to database
            await newOrder.save();
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}