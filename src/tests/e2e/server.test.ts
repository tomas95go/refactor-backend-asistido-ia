import request from 'supertest';
import dotenv from "dotenv";
import { Server } from "node:http";
import mongoose from "mongoose";
import { createServer } from '../../app';
import {OrderStatus} from "../../order/domain/constant/status";
import {DiscountCodes} from "../../order/domain/constant/discount-code";

dotenv.config({ path: '.env.test' });

describe('Status endpoint', () => {
    let server: Server;

    beforeAll(() => {
        const SERVER_PORT = process.env.SERVER_PORT;
        const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

        if(!DATABASE_CONNECTION_STRING || !SERVER_PORT) {
            console.error('Missing environment variables');
            process.exit(1);
        }

        server = createServer(SERVER_PORT, DATABASE_CONNECTION_STRING)
    });

    afterAll(() => {
        server.close();
    })


    it('checks API health', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});

async function createValidOrder(server: Server, discountCode?: string) {
    const orderRequest = {
        items: [{
            productId: 'ae9cbd56-d4f7-4970-b06c-0f08839147fd',
            quantity: 2,
            price: 20
        }],
        discountCode: discountCode,
        shippingAddress: 'Avenida Siempreviva 100'
    }

    return await request(server).post('/orders').send(orderRequest);
}

async function getValidOrder(server: Server) {
    const orders = await request(server).get('/orders');
    return orders.body[0];
}

describe('Order management module', () => {

    let server: Server;

    beforeAll(() => {
        const SERVER_PORT = process.env.SERVER_PORT;
        const DATABASE_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

        if(!DATABASE_CONNECTION_STRING || !SERVER_PORT) {
            console.error('Missing environment variables');
            process.exit(1);
        }

        server = createServer(SERVER_PORT, DATABASE_CONNECTION_STRING)
    });

    afterAll(() => {
        server.close();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    describe('Create a new order', () => {

        it('Should create an order without discount', async () => {
            const response = await createValidOrder(server);
            expect(response.status).toBe(200);
            expect(response.text).toBe(`Order created with total: 40`);

            const order = await getValidOrder(server);

            expect(order.items[0].productId).toBe('ae9cbd56-d4f7-4970-b06c-0f08839147fd');
            expect(order.items[0].quantity).toBe(2);
            expect(order.items[0].price).toBe(20);
            expect(order.status).toBe(OrderStatus.Created);
            expect(order.discountCode).toBe(undefined);
            expect(order.shippingAddress).toBe('Avenida Siempreviva 100');
            expect(order.total).toBe(40);
        });

        it('Should create an order with discount', async () => {
            const response = await createValidOrder(server, DiscountCodes.DISCOUNT20);
            expect(response.status).toBe(200);
            expect(response.text).toBe(`Order created with total: 32`);

            const order = await getValidOrder(server);

            expect(order.items[0].productId).toBe('ae9cbd56-d4f7-4970-b06c-0f08839147fd');
            expect(order.items[0].quantity).toBe(2);
            expect(order.items[0].price).toBe(20);
            expect(order.status).toBe(OrderStatus.Created);
            expect(order.discountCode).toBe(DiscountCodes.DISCOUNT20);
            expect(order.shippingAddress).toBe('Avenida Siempreviva 100');
            expect(order.total).toBe(32)
        });

        it('Should prevent the creation of an order without items', async () => {
            const orderRequest = {
                items: [],
                discountCode: DiscountCodes.DISCOUNT20,
                shippingAddress: 'Avenida Siempreviva 100'
            }

            const response = await request(server).post('/orders').send(orderRequest);
            expect(response.status).toBe(200);
            expect(response.text).toBe(`The order must have at least one item`);

            const orders = await request(server).get('/orders');

            expect(orders.body).toHaveLength(0);
        });

    });

    describe('List orders', () => {

        it('Should list all orders', async () => {
            await createValidOrder(server);

            const orders = await request(server).get('/orders');
            expect(orders.status).toBe(200);
            expect(orders.body).toHaveLength(1);
        });

        it('Should not list orders when there are not any', async () => {
            const orders = await request(server).get('/orders');

            expect(orders.status).toBe(200);
            expect(orders.body).toHaveLength(0);
        });

    });

    describe('Updated an order', () => {

        it('Should update the address of an existing order', async () => {
            await createValidOrder(server);
            const createdOrder = await getValidOrder(server);

            const newOrderAddress = {
                shippingAddress: 'Salt street 200',
            };

            const updateOrderResponse = await request(server).put(`/orders/${createdOrder._id}`).send(newOrderAddress);
            expect(updateOrderResponse.status).toBe(200);

            const updatedOrder = await getValidOrder(server);
            expect(updateOrderResponse.text).toBe(`Order updated. New status: ${updatedOrder.status}`);
            expect(updatedOrder.shippingAddress).toBe(newOrderAddress.shippingAddress);
        });

        it('Should apply a discount to an existing order', async () => {
            await createValidOrder(server);
            const createdOrder = await getValidOrder(server);

            const newDiscountCode = {
                discountCode: DiscountCodes.DISCOUNT20,
            };

            const updateOrderResponse = await request(server).put(`/orders/${createdOrder._id}`).send(newDiscountCode);
            expect(updateOrderResponse.status).toBe(200);

            const updatedOrder = await getValidOrder(server);
            expect(updateOrderResponse.text).toBe(`Order updated. New status: ${updatedOrder.status}`);
            expect(updatedOrder.discountCode).toBe(newDiscountCode.discountCode);
            expect(updatedOrder.total).toBe(32);
        });

        it('Should complete an existing order', async () => {
            await createValidOrder(server);
            const createdOrder = await getValidOrder(server);

            const newStatus = {
                status: OrderStatus.Completed,
            };

            const updateOrderResponse = await request(server).put(`/orders/${createdOrder._id}`).send(newStatus);
            expect(updateOrderResponse.status).toBe(200);

            const updatedOrder = await getValidOrder(server);
            expect(updateOrderResponse.text).toBe(`Order updated. New status: ${updatedOrder.status}`);
            expect(updatedOrder.status).toBe(newStatus.status);
        });

        it('Should prevent the modification of an non-existing order', async () => {
            const newDiscountCode = {
                discountCode: DiscountCodes.DISCOUNT20,
            };

            const failedUpdateOrderResponse = await request(server).put(`/orders/123`).send(newDiscountCode);
            expect(failedUpdateOrderResponse.status).toBe(200);
            expect(failedUpdateOrderResponse.text).toBe(`Order not found`);
        });
    })

    describe('Delete an order', () => {

        it('Should delete an order', async () => {
            await createValidOrder(server);
            const order = await getValidOrder(server);

            const deleteResponse = await request(server).delete(`/orders/${order._id}`);
            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.text).toBe(`Order deleted`);
        });

    });

    describe('Completes an order', () => {

        it('Should complete an existing order', async () => {
            await createValidOrder(server);
            const createdOrder = await getValidOrder(server);

            const completeOrderResponse = await request(server).post(`/orders/${createdOrder._id}/complete`);
            expect(completeOrderResponse.status).toBe(200);
            expect(completeOrderResponse.text).toBe(`Order with id ${createdOrder._id} completed`);

            const completedOrder = await getValidOrder(server);
            expect(completedOrder.status).toBe(`COMPLETED`);
        });

        it('Should prevent the completion of an non-existing order', async () => {
            const completeOrderResponse = await request(server).post(`/orders/123/complete`);
            expect(completeOrderResponse.status).toBe(200);
            expect(completeOrderResponse.text).toBe(`Order not found to complete`);
        });

        it('Should prevent the completion of an order which status is NOT created', async () => {
            await createValidOrder(server);
            const createdOrder = await getValidOrder(server);

            await request(server).post(`/orders/${createdOrder._id}/complete`);
            const failedCompletionOrderResponse = await request(server).post(`/orders/${createdOrder._id}/complete`);
            expect(failedCompletionOrderResponse.status).toBe(200);

            const failedOrder = await getValidOrder(server);
            expect(failedCompletionOrderResponse.text).toBe(`Cannot complete an order with status: ${failedOrder.status}`);
        });

    });

});