import {Factory} from "../../factory";
import {OrderUseCase, RequestOrder} from "../../order/application/order";
import {InMemoryRepository} from "../integration/in-memory-repository.test";

describe('Order use case', () => {

    let orderUseCase: OrderUseCase = Factory.createOrderUseCase(InMemoryRepository.create());

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
})