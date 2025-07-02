import {OrderStatus} from "../domain/constant/status";
import {DiscountCodes} from "../domain/constant/discount-code";
import {OrderRepository} from "../domain/repository/repository";
import {Order, OrderDto} from "../domain/aggregate/order";
import {OrderLine} from "../domain/value-object/order-line";
import {Id} from "../domain/value-object/id";
import {PositiveNumber} from "../domain/value-object/positive-number";
import {Address} from "../domain/value-object/address";
import {DomainError} from "../domain/error/error";

export type RequestOrder = {
    items: { productId: string, quantity: number, price: number }[],
    shippingAddress: string,
    discountCode?: DiscountCodes
};
export type RequestOrderUpdate = {
    id: string,
    status: OrderStatus,
    shippingAddress: string,
    discountCode: DiscountCodes
};

export class OrderUseCase {
    constructor(private orderRepository: OrderRepository) {
    }

    async createOrderUseCase(dto: RequestOrder): Promise<string> {
        const {items, shippingAddress, discountCode} = dto;

        const order: Order = Order.create(
            items.map((item: { productId: string, quantity: number, price: number }) => {
                return OrderLine.create(
                    Id.from(item.productId),
                    PositiveNumber.create(item.quantity),
                    PositiveNumber.create(item.price)
                );
            }),
            Address.create(shippingAddress),
            discountCode
        );

        await this.orderRepository.save(order);

        return `Order created with total: ${order.toDto().total}`;
    }

    async getAllOrdersUseCase(): Promise<OrderDto[]> {
        const orders: Order[] | [] = await this.orderRepository.findAll();
        return orders.map(order => order.toDto());
    }

    async updateOrderUseCase(dto: RequestOrderUpdate): Promise<string> {
        const {id, status, shippingAddress, discountCode} = dto;

        const persistedOrder: Order | null = await this.orderRepository.findById(Id.from(id));

        if (!persistedOrder) {
            return 'Order not found';
        }

        if (shippingAddress) {
            persistedOrder.updateShippingAddress(Address.create(shippingAddress));
        }

        if (discountCode) {
            persistedOrder.updateDiscountCode(discountCode);
        }

        if (status) {
            persistedOrder.complete();
        }

        await this.orderRepository.save(persistedOrder);

        return `Order updated. New status: ${persistedOrder.toDto().status}`;
    }

    async completeOrderUseCase(id: string): Promise<string> {
        const persistedOrder: Order | null = await this.orderRepository.findById(Id.from(id));

        if (!persistedOrder) {
            throw new DomainError('Order not found to complete');
        }

        const order: Order = Order.toDomain(persistedOrder.toDto());
        order.complete();

        await this.orderRepository.save(order);
        return `Order with id ${id} completed`;
    }

    async deleteOrderUseCase(id: string): Promise<string> {
        const order: Order | null = await this.orderRepository.findById(Id.from(id));

        if (!order) {
            return 'Order not found';
        }

        await this.orderRepository.delete(Id.from(id));
        return 'Order deleted';
    }
}