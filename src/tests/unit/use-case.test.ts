import {Factory} from "../../factory";
import {OrderUseCase, RequestOrder, RequestOrderUpdate} from "../../order/application/order";
import {InMemoryRepository} from "../integration/in-memory-repository.test";
import {DiscountCodes} from "../../order/domain/constant/discount-code";
import {OrderDto} from "../../order/domain/aggregate/order";
import {OrderStatus} from "../../order/domain/constant/status";

describe('Order use case', () => {

    let memoryOrderRepository: InMemoryRepository;
    let orderUseCase: OrderUseCase;

    beforeAll(() => {
        memoryOrderRepository = InMemoryRepository.create();
        orderUseCase = Factory.createOrderUseCase(memoryOrderRepository);
    });

    beforeEach(() => {
        memoryOrderRepository.reset();
    });

    it('Should create a new order without discount', async () => {
        // Arrange
        const newOrder: RequestOrder = {
            items: [{
                productId: '32aba416-8455-4018-82c4-d56253c152e9',
                quantity: 2,
                price: 200
            }],
            shippingAddress: 'Avenida siempreviva 101'
        };
        // Act
        const savedOrder = await orderUseCase.createOrderUseCase(newOrder);
        // Assert
        expect(savedOrder).toBe('Order created with total: 400');
    });

    it('Should create a new order with discount', async () => {
        // Arrange
        const newOrder: RequestOrder = {
            items: [{
                productId: '32aba416-8455-4018-82c4-d56253c152e9',
                quantity: 2,
                price: 200
            }],
            shippingAddress: 'Avenida siempreviva 101',
            discountCode: DiscountCodes.DISCOUNT20
        };
        // Act
        const savedOrder = await orderUseCase.createOrderUseCase(newOrder);
        // Assert
        expect(savedOrder).toBe('Order created with total: 320');
    });

    it('Should list all orders', async () => {
        // Arrange
        const newOrder: RequestOrder = {
            items: [{
                productId: '32aba416-8455-4018-82c4-d56253c152e9',
                quantity: 2,
                price: 200
            }],
            shippingAddress: 'Avenida siempreviva 101',
            discountCode: DiscountCodes.DISCOUNT20
        };
        await orderUseCase.createOrderUseCase(newOrder);
        // Act
        const savedOrders: OrderDto[] = await orderUseCase.getAllOrdersUseCase();
        // Assert
        expect(savedOrders).toHaveLength(1);
    });

    it('Should update an existing order', async () => {
        // Arrange
        const newOrder: RequestOrder = {
            items: [{
                productId: '32aba416-8455-4018-82c4-d56253c152e9',
                quantity: 2,
                price: 200
            }],
            shippingAddress: 'Avenida siempreviva 101',
            discountCode: DiscountCodes.DISCOUNT20
        };
        await orderUseCase.createOrderUseCase(newOrder);
        const savedOrders: OrderDto[] = await orderUseCase.getAllOrdersUseCase();
        const savedOrder: OrderDto = savedOrders[0];
        const updateOrder: RequestOrderUpdate = {
            id: savedOrder.id,
            status: OrderStatus.Completed
        };
        // Act
        const updatedOrder = await orderUseCase.updateOrderUseCase(updateOrder);
        // Assert
        expect(updatedOrder).toBe('Order updated. New status: COMPLETED');
    });

    it('Should complete an existing order', async () => {
        // Arrange
        const newOrder: RequestOrder = {
            items: [{
                productId: '32aba416-8455-4018-82c4-d56253c152e9',
                quantity: 2,
                price: 200
            }],
            shippingAddress: 'Avenida siempreviva 101',
            discountCode: DiscountCodes.DISCOUNT20
        };
        await orderUseCase.createOrderUseCase(newOrder);
        const savedOrders: OrderDto[] = await orderUseCase.getAllOrdersUseCase();
        const savedOrder: OrderDto = savedOrders[0];
        // Act
        const updatedOrder = await orderUseCase.completeOrderUseCase(savedOrder.id);
        // Assert
        expect(updatedOrder).toBe(`Order with id ${savedOrder.id} completed`);
    });

    it('Should delete an existing order', async () => {
        // Arrange
        const newOrder: RequestOrder = {
            items: [{
                productId: '32aba416-8455-4018-82c4-d56253c152e9',
                quantity: 2,
                price: 200
            }],
            shippingAddress: 'Avenida siempreviva 101',
            discountCode: DiscountCodes.DISCOUNT20
        };
        await orderUseCase.createOrderUseCase(newOrder);
        const savedOrders: OrderDto[] = await orderUseCase.getAllOrdersUseCase();
        const savedOrder: OrderDto = savedOrders[0];
        // Act
        await orderUseCase.deleteOrderUseCase(savedOrder.id);
        // Assert
        const deletedOrders: OrderDto[] = await orderUseCase.getAllOrdersUseCase();
        expect(deletedOrders.length).toBe(0);
    });
})