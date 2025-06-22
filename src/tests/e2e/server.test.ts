import request from 'supertest';
import dotenv from "dotenv";
import { Server } from "node:http";
import { createServer } from '../../app';

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

describe('Create an order', () => {
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

    it('Should create an order without discount', async () => {
        const orderRequest = {
            items: [{
                productId: 'ae9cbd56-d4f7-4970-b06c-0f08839147fd',
                quantity: 2,
                price: 20
            }],
            shippingAddress: 'Avenida Siempreviva 100'
        }

        const response = await request(server).post('/orders').send(orderRequest);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Order created with total: 40`);

        const orders = await request(server).get('/orders');
        const order = orders.body[0];

        expect(orders.body).toHaveLength(1);
        expect(order.items[0].productId).toBe(orderRequest.items[0].productId);
        expect(order.items[0].quantity).toBe(orderRequest.items[0].quantity);
        expect(order.items[0].price).toBe(orderRequest.items[0].price);
        expect(order.status).toBe('CREATED');
        expect(order.discountCode).toBe(undefined);
        expect(order.shippingAddress).toBe(orderRequest.shippingAddress);
        expect(order.total).toBe(40)
    });

    it('Should create an order with discount', async () => {
        const orderRequest = {
            items: [{
                productId: 'ae9cbd56-d4f7-4970-b06c-0f08839147fd',
                quantity: 2,
                price: 20
            }],
            discountCode: 'DISCOUNT20',
            shippingAddress: 'Avenida Siempreviva 100'
        }

        const response = await request(server).post('/orders').send(orderRequest);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Order created with total: 32`);

        const orders = await request(server).get('/orders');
        const order = orders.body[0];

        expect(orders.body).toHaveLength(1);
        expect(order.items[0].productId).toBe(orderRequest.items[0].productId);
        expect(order.items[0].quantity).toBe(orderRequest.items[0].quantity);
        expect(order.items[0].price).toBe(orderRequest.items[0].price);
        expect(order.status).toBe('CREATED');
        expect(order.discountCode).toBe(orderRequest.discountCode);
        expect(order.shippingAddress).toBe(orderRequest.shippingAddress);
        expect(order.total).toBe(32)
    });
});