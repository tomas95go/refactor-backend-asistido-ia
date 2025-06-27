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

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
    try {
        console.log("POST /orders");
        const {items, discountCode, shippingAddress} = req.body;

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

        const repository: OrderRepository = await Factory.getOrderRepository();

        await repository.save(order);
        res.send(`Order created with total: ${order.toPersistence().total}`);
    } catch (error) {
        if(error instanceof DomainError) {
            return res.send(error.message);
        }
        res.send('Unexpected error');
    }
}

// Get all orders
export const getAllOrders = async (_req: Request, res: Response) => {
    console.log("GET /orders");

    const repository: OrderRepository = await Factory.getOrderRepository();
    const orders: Order[] | []= await repository.findAll();
    const ordersDto = orders.map(order => order.toPersistence());
    res.json(ordersDto);
};

// Update order
export const updateOrder = async (req: Request, res: Response) => {
    console.log("PUT /orders/:id");
    const { id } = req.params;
    const { status, shippingAddress, discountCode } = req.body;

    const order = await OrderModel.findById(id);
    if (!order) {
        return res.send('Order not found');
    }

    if (shippingAddress) {
        order.shippingAddress = shippingAddress;
    }

    if (status) {
        if (status === OrderStatus.Completed && order.items.length === 0) {
            return res.send('Cannot complete an order without items');
        }
        order.status = status;
    }

    if (discountCode) {
        order.discountCode = discountCode;
        if (discountCode === DiscountCodes.DISCOUNT20) {
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

    await order.save();
    res.send(`Order updated. New status: ${order.status}`);
};

// Complete order
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

// Delete order
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
