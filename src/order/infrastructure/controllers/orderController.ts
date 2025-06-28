import { Request, Response } from 'express';
import { OrderModel } from '../models/orderModel';
import {OrderStatus} from "../../domain/constant/status";
import {DiscountCode, DiscountCodes} from "../../domain/constant/discount-code";
import {OrderLine} from "../../domain/value-object/order-line";
import {Id} from "../../domain/value-object/id";
import {PositiveNumber} from "../../domain/value-object/positive-number";
import {Address} from "../../domain/value-object/address";
import {Order} from "../../domain/aggregate/order";
import {DomainError} from "../../domain/error/error";
import {Factory} from "../../../factory";
import {OrderRepository} from "../../domain/repository/repository";

async function createOrderUseCase(dto: { items: { productId: string, quantity: number, price: number }[], shippingAddress: string, discountCode?: DiscountCodes }, repository: OrderRepository): Promise<string> {
    const { items, shippingAddress, discountCode } = dto;

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

    await repository.save(order);

    return `Order created with total: ${order.toPersistence().total}`;
}

// ToDo: Introduce a type for api order response
async function getAllOrdersUseCase(repository: OrderRepository) {
    const orders: Order[] | [] = await repository.findAll();
    return orders.map(order => order.toPersistence());
}

export const createOrder = async (req: Request, res: Response) => {
    const repository: OrderRepository = await Factory.getOrderRepository();
    try {
        const requestOrder = req.body;

        const createdOrder = await createOrderUseCase(requestOrder, repository);
        res.send(createdOrder);
    } catch (error) {
        if(error instanceof DomainError) {
            return res.send(error.message);
        }
        res.send('Unexpected error');
    }
}

export const getAllOrders = async (_req: Request, res: Response) => {
    const repository: OrderRepository = await Factory.getOrderRepository();
    const ordersDto = await getAllOrdersUseCase(repository);
    res.json(ordersDto);
};

// ToDo: introduce a type for update dto
async function updateOrderUseCase(dto: { id: string, status: string, shippingAddress: string, discountCode: DiscountCodes }, repository: OrderRepository): Promise<string> {
    const { id, status, shippingAddress, discountCode } = dto;

    const persistedOrder: Order | null = await repository.findById(Id.from(id));

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

    await repository.save(persistedOrder);

    return `Order updated. New status: ${persistedOrder.toPersistence().status}`;
}

export const updateOrder = async (req: Request, res: Response) => {
    const repository: OrderRepository = await Factory.getOrderRepository();

    const {id} = req.params;
    const {status, shippingAddress, discountCode} = req.body;

    const dto = {
        id,
        status,
        shippingAddress,
        discountCode,
    };

    const updatedOrder = await updateOrderUseCase(dto, repository);
    res.send(updatedOrder);
}

export const completeOrder = async (req: Request, res: Response) => {
    try {
        console.log("POST /orders/:id/complete");
        const { id } = req.params;

        const repository: OrderRepository = await Factory.getOrderRepository();

        const persistedOrder: Order | null = await repository.findById(Id.from(req.params.id));

        if (!persistedOrder) {
            return res.send('Order not found to complete');
        }

        const order: Order = Order.toDomain(persistedOrder.toPersistence());
        order.complete();

        await repository.save(order);
        res.send(`Order with id ${id} completed`);
    } catch (error) {
        if(error instanceof DomainError) {
            return res.send(error.message);
        }
        res.send('Unexpected error');
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    console.log("DELETE /orders/:id");
    const repository: OrderRepository = await Factory.getOrderRepository();

    const order: Order | null = await repository.findById(Id.from(req.params.id));

    if (!order) {
        return res.send('Order not found');
    }

    await repository.delete(Id.from(req.params.id));
    res.send('Order deleted');
};
