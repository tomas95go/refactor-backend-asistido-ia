import { DiscountCode, Id, Item, ShippingAddress, Status, Total } from "./value-objects";
import {IItems, IOrder} from "./order.aggregate-interface";

export class OrderAggregate {
    private id: Id;
    private items: Item[];
    private status: Status;
    private discountCode: DiscountCode;
    private shippingAddress: ShippingAddress;
    private total: Total;

    constructor(dto: IOrder) {
        this.id = new Id(dto.id || '');
        this.items = dto.items!.map(item => new Item(item));
        this.status = new Status(dto.status || '');
        this.discountCode = new DiscountCode(dto.discountCode || '');
        this.shippingAddress = new ShippingAddress(dto.shippingAddress);
        this.total = new Total(dto.total || 0);
    }

    static create(dto: IOrder): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(dto.items!);

        // Calculate order total without discount.
        const total: number = dto.items!.map(item => {
            let total = 0;
            total += (item.price || 0) * (item.quantity || 0);
            return total;
        })[0];

        // Calculate discount multiplier.
        const discount: number = dto.discountCode === 'DISCOUNT20' ? 0.8 : 1;

        // Calculate order total considering discount.
        dto.total = total * discount;

        // Set status to created
        dto.status = 'CREATED';

        // Build aggregate
        return new OrderAggregate(dto);
    }

    static update(persistedOrder: OrderAggregate, newOrderData: IOrder): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(persistedOrder.items.map(item => item.value ));

        // Calculate order total without discount.
        const total: number = persistedOrder.items.map(item => {
            let total = 0;
            total += (item.value.price || 0) * (item.value.quantity || 0);
            return total;
        })[0];

        // Calculate discount multiplier.
        const discount: number = newOrderData.discountCode === 'DISCOUNT20' ? 0.8 : 1;

        // Calculate order total considering discount.
        newOrderData.total = total * discount;

        // Updated data
        const updatedData = {
            id: persistedOrder.id.value,
            items: persistedOrder.items.map(item => item.value),
            status: newOrderData.status ? newOrderData.status : persistedOrder.status.value,
            discountCode: newOrderData.discountCode ? newOrderData.discountCode : persistedOrder.discountCode.value,
            shippingAddress: newOrderData.shippingAddress ? newOrderData.shippingAddress : persistedOrder.shippingAddress.value,
            total: newOrderData.total,
        };

        // Build aggregate
        return new OrderAggregate(updatedData);
    }

    static complete(persistedOrder: OrderAggregate): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(persistedOrder.items.map(item => item.value ));

        // Ensure status transition is valid.
        OrderAggregate.ensureOrderIsCreated(persistedOrder.status.value);

        // Updated data
        const updatedData = {
            id: persistedOrder.id.value,
            items: persistedOrder.items.map(item => item.value),
            status: 'COMPLETED',
            discountCode: persistedOrder.discountCode.value,
            shippingAddress: persistedOrder.shippingAddress.value,
            total: persistedOrder.total.value,
        };

        // Build aggregate
        return new OrderAggregate(updatedData);
    }

    /*
    * Invariants
    * */

    // Ensure order contains at least 1 item
    static ensureOrderHasItems(dto: IItems[]): void {
        if (!dto || !Array.isArray(dto) || dto.length === 0) {
            throw new Error('The order must have at least one item');
        }
    }

    static ensureOrderIsCreated(status: string): void {
        if (status !== 'CREATED') {
            throw new Error(`Cannot complete an order with status: ${status}`);
        }
    }

    /* External mapping */
    static toPersistence(orderAggregate: OrderAggregate): IOrder {
        return {
            id: orderAggregate.id.value,
            items: orderAggregate.items.map(item => item.value),
            status: orderAggregate.status.value,
            discountCode: orderAggregate.discountCode.value,
            shippingAddress: orderAggregate.shippingAddress.value,
            total: orderAggregate.total.value,
        };
    }

    static toApi(orderAggregate: OrderAggregate): IOrder {
        return {
            id: orderAggregate.id.value,
            items: orderAggregate.items.map(item => item.value),
            status: orderAggregate.status.value,
            discountCode: orderAggregate.discountCode.value,
            shippingAddress: orderAggregate.shippingAddress.value,
            total: orderAggregate.total.value,
        };
    }
}