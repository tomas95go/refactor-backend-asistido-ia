import { Request, Response } from 'express';
import { OrderModel } from '../models/orderModel';
import {OrderStatus} from "../order/domain/constant/status";
import {DiscountCode, DiscountCodes} from "../order/domain/constant/discount-code";
import {OrderLine} from "../order/domain/value-object/order-line";
import {Id} from "../order/domain/value-object/id";
import {PositiveNumber} from "../order/domain/value-object/positive-number";
import {Address} from "../order/domain/value-object/address";
import {Order} from "../order/domain/aggregate/order";
import {DomainError} from "../order/domain/error/error";

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

        const orderPersistence = order.toPersistence();

        const newOrder = new OrderModel({
            _id: orderPersistence._id,
            items: orderPersistence.items,
            status: orderPersistence.status,
            discountCode: orderPersistence.discountCode,
            shippingAddress: orderPersistence.shippingAddress,
            total: orderPersistence.total,
        });

        await newOrder.save();
        res.send(`Order created with total: ${orderPersistence.total}`);
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
    const orders = await OrderModel.find();
    res.json(orders);
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

        const orderDocument = await OrderModel.findById(id);

        if (!orderDocument) {
            return res.send('Order not found to complete');
        }

        const persistedOrder = {
            _id: orderDocument._id,
            items: orderDocument.items.map(item => { return { productId: item.productId, quantity: item.quantity, price: item.price } },),
            shippingAddress: orderDocument.shippingAddress,
            status: orderDocument.status as OrderStatus,
            discountCode: orderDocument.discountCode
        }

        const order: Order = Order.toDomain(persistedOrder);
        order.complete();

        const orderToPersist = order.toPersistence();
        const orderDocumentToPersist = new OrderModel({...orderToPersist});
        await OrderModel.findOneAndReplace({_id: id}, orderDocumentToPersist, { new: true });
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
    await OrderModel.findByIdAndDelete(req.params.id);
    res.send('Order deleted');
};
