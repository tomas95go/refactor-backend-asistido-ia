// Infrastructure
import { OrderDocumentPersistenceEntity } from "../../../infrastructure/persistence/order.document-persistence";

// Application
import { IUpdateOrder } from "./update-order.dto";

export class UpdateOrder {
    async execute(dto: IUpdateOrder): Promise<void> {
        try {
            // Extract order properties
            const id = dto.id;
            const status = dto.status;
            const discountCode = dto.discountCode;
            const shippingAddress = dto.shippingAddress;

            // Execute use case and return response
            const order = await OrderDocumentPersistenceEntity.findById(id);

            // Ensure order exists
            if (!order) {
                throw new Error('Order not found');
            }

            // Change order shipping address
            if (shippingAddress) {
                order.shippingAddress = shippingAddress;
            }

            // Change order status
            if (status) {
                // Ensure an order can't be completed when it has no items. ToDo: Business logic should be on aggregate
                if (status === 'COMPLETED' && order.items.length === 0) {
                    throw new Error('Cannot complete an order without items');
                }
                order.status = status;
            }

            // Apply order discount. ToDo: Business logic should be on aggregate
            if (discountCode) {
                order.discountCode = discountCode;
                if (discountCode === 'DISCOUNT20') {
                    let newTotal = 0;
                    for (const item of order.items) {
                        newTotal += (item.price || 0) * (item.quantity || 0);
                    }
                    newTotal *= 0.8;
                    order.total = newTotal;
                } else {
                    console.log('Invalid or not implemented discount code');
                }
            }

            // Save changes
            await order.save();
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}