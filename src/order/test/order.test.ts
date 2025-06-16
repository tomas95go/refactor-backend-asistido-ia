import request from 'supertest';
import { app } from '../../app';
import { OrderDocumentPersistenceEntity } from "../infrastructure/persistence/order.document-persistence";

/* Business goal:
*   Order management module:
**/

describe('Order management module',() => {

    describe('List orders', () => {

        afterEach(async () => {
            await OrderDocumentPersistenceEntity.deleteMany();
        });

        it('List all orders', async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                shippingAddress: 'Argentina 100'
            };

            /*
            * Act
            * */
            await request(app).post('/orders').send(newOrder);

            /*
            * Assert
            * */
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            expect(createdOrders.status).toBe(200);
            expect(createdOrders.body).toHaveLength(1);
        });

    });

    describe('Create a new order', () => {

        afterEach(async () => {
            await OrderDocumentPersistenceEntity.deleteMany();
        });

        /* Happy path */
        it('Should create a new order without discount', async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };

            /*
            * Act
            * */
            await request(app).post('/orders').send(newOrder);

            /*
            * Assert
            * */
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            const createdOrder = createdOrders.body[0];
            expect(createdOrders.status).toBe(200);
            expect(createdOrders.body).toHaveLength(1);
            expect(createdOrder.total).toBe(40);
            expect(createdOrder.shippingAddress).toBe(newOrder.shippingAddress);
            expect(createdOrder.status).toBe('CREATED')
        });

        it('Should create a new order with discount', async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: 'DISCOUNT20',
                shippingAddress: 'Argentina 100'
            };

            /*
            * Act
            * */
            await request(app).post('/orders').send(newOrder);

            /*
            * Assert
            * */
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            expect(createdOrders.status).toBe(200);
            expect(createdOrders.body).toHaveLength(1);
            expect(createdOrders.body[0].total).toBe(32);
            expect(createdOrders.body[0].shippingAddress).toBe(newOrder.shippingAddress);
        });

        it('Should not create a new order when there are no items', async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [],
                discountCode: 'DISCOUNT20',
                shippingAddress: 'Argentina 100'
            };

            /*
            * Act
            * */
            await request(app).post('/orders').send(newOrder);

            /*
            * Assert
            * */
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            expect(createdOrders.status).toBe(200);
            expect(createdOrders.body).toHaveLength(0);
        });

        /* Enforce business rules */
        it('Should prevent from creating a new order without items', async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };

            /*
            * Act
            * */
            const failedOrderCreation = await request(app).post('/orders').send(newOrder);

            /*
        * Assert
        * */
            expect(failedOrderCreation.text).toBe('The order must have at least one item');
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            expect(createdOrders.status).toBe(200);
            expect(createdOrders.body).toHaveLength(0);
        });
    });

    describe('Update an existing order', () => {

        afterEach(async () => {
            await OrderDocumentPersistenceEntity.deleteMany();
        });

        it('Should apply a discount to an existing order', async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            /*
            * Act
            * */
            const createdOrder = createdOrders.body[0];
            const updatedOrderData = {
                discountCode: 'DISCOUNT20',
            };
            await request(app).put(`/orders/${createdOrder.id}`).send(updatedOrderData);

            /*
            * Assert
            * */
            const updatedOrders = await request(app).get('/orders').set('Accept', 'application/json');
            const updatedOrder = updatedOrders.body[0];

            // Order before applying discount
            expect(createdOrder.total).toBe(40);
            expect(createdOrder.discountCode).toBe('');
            // Order after applying discount
            expect(updatedOrders.status).toBe(200);
            expect(updatedOrder.total).toBe(32);
            expect(updatedOrder.discountCode).toBe('DISCOUNT20');
        });

        it(`Should modify the address of an existing order`, async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            /*
            * Act
            * */
            const createdOrder = createdOrders.body[0];
            const updatedOrderData = {
                shippingAddress: 'Madrid 101',
            };
            await request(app).put(`/orders/${createdOrder.id}`).send(updatedOrderData);

            /*
            * Assert
            * */
            const updatedOrders = await request(app).get('/orders').set('Accept', 'application/json');
            const updatedOrder = updatedOrders.body[0];
            // Order before completion
            expect(createdOrder.shippingAddress).toBe('Argentina 100');
            // Order after completion
            expect(updatedOrders.status).toBe(200);
            expect(updatedOrder.shippingAddress).toBe('Madrid 101');
        });

        it(`Should modify order status`, async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            /*
            * Act
            * */
            const createdOrder = createdOrders.body[0];
            const updatedOrderData = {
                status: 'FOO',
            };
            await request(app).put(`/orders/${createdOrder.id}`).send(updatedOrderData);

            /*
            * Assert
            * */
            const updatedOrders = await request(app).get('/orders').set('Accept', 'application/json');
            const updatedOrder = updatedOrders.body[0];
            // Order before completion
            expect(createdOrder.status).toBe('CREATED');
            // Order after completion
            expect(updatedOrders.status).toBe(200);
            expect(updatedOrder.status).toBe('FOO');
        });

        /* Enforce business rules */
        it(`Should prevent the edition of an order that doesn't exist`, async () => {
            /*
            * Arrange
            * */
            const orderId = 'abc1234';
            /*
            * Act
            * */
            const updatedOrderData = {
                status: 'COMPLETED',
            };
            const failedOrderCompletion = await request(app).put(`/orders/${orderId}`).send(updatedOrderData);

            /*
            * Assert
            * */
            expect(failedOrderCompletion.text).toBe('Order not found');
        });

        it(`Should prevent the completion of an existing order when it doesn't have items`, async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            /*
            * Act
            * */
            const createdOrder = createdOrders.body[0];
            const updatedOrderData = {
                status: 'COMPLETED',
            };

            // Simulate someone modifying the order in the database and deleting all the items
            const order = await OrderDocumentPersistenceEntity.findById(createdOrder.id);
            order!.items = [];
            await order!.save();
            const failedOrderCompletion = await request(app).put(`/orders/${createdOrder.id}`).send(updatedOrderData);

            /*
            * Assert
            * */
            expect(failedOrderCompletion.text).toBe('The order must have at least one item');
        });

        it('Should remove discount from total when discount code changes and does not apply', async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: 'DISCOUNT20',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            /*
            * Act
            * */
            const createdOrder = createdOrders.body[0];
            const updatedOrderData = {
                discountCode: 'ENGLISH40',
            };
            await request(app).put(`/orders/${createdOrder.id}`).send(updatedOrderData);

            /*
            * Assert
            * */
            const updatedOrders = await request(app).get('/orders').set('Accept', 'application/json');
            const updatedOrder = updatedOrders.body[0];
            // Order before with previous discount code
            expect(createdOrder.total).toBe(32);
            expect(createdOrder.discountCode).toBe('DISCOUNT20');
            // Order after applying a different discount code
            expect(updatedOrders.status).toBe(200);
            expect(updatedOrder.total).toBe(40);
            expect(updatedOrder.discountCode).toBe('ENGLISH40');
        });

    });

    describe('Complete an existing order', () => {

        afterEach(async () => {
            await OrderDocumentPersistenceEntity.deleteMany();
        });

        it(`Should complete an existing order`, async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            /*
            * Act
            * */
            const createdOrder = createdOrders.body[0];
            await request(app).post(`/orders/${createdOrder.id}/complete`).send();

            /*
            * Assert
            * */
            const completedOrders = await request(app).get('/orders').set('Accept', 'application/json');
            const completedOrder = completedOrders.body[0];

            expect(completedOrders.status).toBe(200);
            expect(completedOrder.status).toBe('COMPLETED');
        });

        /* Enforce business rules */
        it(`Should prevent the completion of an order that doesn't exist`, async () => {
            /*
            * Arrange
            * */
            const orderId = 'abc1234';
            /*
            * Act
            * */
            const failedOrderCompletion = await request(app).post(`/orders/${orderId}/complete`).send();

            /*
            * Assert
            * */
            expect(failedOrderCompletion.text).toBe('Order not found to complete');
        });

        it(`Should prevent the completion of an order when it's status is not CREATED`, async () => {
            /*
            * Arrange
            * */
            // Create a new order
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');

            // Update the order with an 'IN PROGRESS' status
            const createdOrder = createdOrders.body[0];
            const updatedOrderData = {
                status: 'IN_PROGRESS',
            };
            await request(app).put(`/orders/${createdOrder.id}`).send(updatedOrderData);

            /*
            * Act
            * */
            const failedOrderCompletion = await request(app).post(`/orders/${createdOrder.id}/complete`).send();

            /*
            * Assert
            * */
            const updatedOrders = await request(app).get('/orders').set('Accept', 'application/json');
            const updatedOrder = updatedOrders.body[0];
            expect(failedOrderCompletion.text).toBe(`Cannot complete an order with status: ${updatedOrder.status}`);
        });

    });

    describe('Delete an existing order', () => {

        afterEach(async () => {
            await OrderDocumentPersistenceEntity.deleteMany();
        });

        it(`Should delete an existing order`, async () => {
            /*
            * Arrange
            * */
            const newOrder = {
                items: [{
                    price: 20,
                    quantity: 2
                }],
                discountCode: '',
                shippingAddress: 'Argentina 100'
            };
            await request(app).post('/orders').send(newOrder);
            const createdOrders = await request(app).get('/orders').set('Accept', 'application/json');
            /*
            * Act
            * */
            const createdOrder = createdOrders.body[0];
            await request(app).delete(`/orders/${createdOrder.id}`).send();

            /*
            * Assert
            * */
            const currentOrders = await request(app).get('/orders').set('Accept', 'application/json');

            expect(currentOrders.status).toBe(200);
            expect(currentOrders.body).toHaveLength(0);
        });

    });

});


