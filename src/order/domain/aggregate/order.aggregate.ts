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
        this.shippingAddress = new ShippingAddress(dto.shippingAddress || '');
        this.total = new Total(dto.total || 0);
    }

    /* Business Logic */
    static place(dto: IOrder): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(dto.items!);

        // Calculate discount multiplier.
        const discountMultiplier: number = DiscountCode.getDiscountMultiplier(dto.discountCode);

        // Calculate order total
        dto.total = Total.calculateTotal(dto.items!, discountMultiplier);

        // Set status to created
        dto.status = Status.create();

        // Ensure status transition is valid.
        OrderAggregate.ensureOrderStatusTransitionIsValid({ from: '', to: dto.status });

        // Build aggregate
        return new OrderAggregate(dto);
    }

    static confirm(persistedOrder: OrderAggregate): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(persistedOrder.items.map(item => item.value));

        // New confirmed status
        const newStatus = Status.confirm();

        // Ensure status transition is valid.
        OrderAggregate.ensureOrderStatusTransitionIsValid({ from: persistedOrder.status.value, to: newStatus });

        // Updated data
        const updatedData = {
            id: persistedOrder.id.value,
            items: persistedOrder.items.map(item => item.value),
            status: newStatus,
            discountCode: persistedOrder.discountCode.value,
            shippingAddress: persistedOrder.shippingAddress.value,
            total: persistedOrder.total.value,
        };

        // Build aggregate
        return new OrderAggregate(updatedData);
    }

    static complete(persistedOrder: OrderAggregate): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(persistedOrder.items.map(item => item.value));

        // New confirmed status
        const newStatus = Status.complete();

        // Ensure status transition is valid.
        OrderAggregate.ensureOrderStatusTransitionIsValid({ from: persistedOrder.status.value, to: newStatus });

        // Updated data
        const updatedData = {
            id: persistedOrder.id.value,
            items: persistedOrder.items.map(item => item.value),
            status: newStatus,
            discountCode: persistedOrder.discountCode.value,
            shippingAddress: persistedOrder.shippingAddress.value,
            total: persistedOrder.total.value,
        };

        // Build aggregate
        return new OrderAggregate(updatedData);
    }

    static changeAddress(persistedOrder: OrderAggregate, newOrderData: IOrder): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(persistedOrder.items.map(item => item.value));

        // Updated data
        const updatedData = {
            id: persistedOrder.id.value,
            items: persistedOrder.items.map(item => item.value),
            status: persistedOrder.status.value,
            discountCode: persistedOrder.discountCode.value,
            shippingAddress: newOrderData.shippingAddress ? newOrderData.shippingAddress : persistedOrder.shippingAddress.value,
            total: newOrderData.total,
        };

        // Build aggregate
        return new OrderAggregate(updatedData);
    }

    static applyDiscount(persistedOrder: OrderAggregate, newOrderData: IOrder): OrderAggregate {
        // Order must have at least one item
        OrderAggregate.ensureOrderHasItems(persistedOrder.items.map(item => item.value));

        OrderAggregate.ensureOrderDiscountWasNotApplied(persistedOrder.discountCode.value);

        // Calculate discount multiplier.
        const discountMultiplier: number = DiscountCode.getDiscountMultiplier(newOrderData.discountCode);

        // Calculate order total
        const newTotal = Total.calculateTotal(persistedOrder.items.map(item => item.value), discountMultiplier);

        // Updated data
        const updatedData = {
            id: persistedOrder.id.value,
            items: persistedOrder.items.map(item => item.value),
            status: persistedOrder.status.value,
            discountCode: newOrderData.discountCode ? newOrderData.discountCode : persistedOrder.discountCode.value,
            shippingAddress: persistedOrder.shippingAddress.value,
            total: newTotal
        };

        // Build aggregate
        return new OrderAggregate(updatedData);
    }

    /*
    * Invariants
    * */
    static ensureOrderHasItems(dto: IItems[]): void {
        if (!dto || !Array.isArray(dto) || dto.length === 0) {
            throw new Error('The order must have at least one item');
        }
    }

    static ensureOrderStatusTransitionIsValid(dto: { from: string, to: string }): void {
        if(!Status.validateStatusTransition(dto)) {
            throw new Error(`Cannot change order status`);
        }
    }

    static ensureOrderDiscountWasNotApplied(discountCode: string): void {
        if(discountCode) {
            throw new Error(`A discount was already applied to order`);
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