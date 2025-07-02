import {Factory} from "../../factory";
import {OrderUseCase, RequestOrder} from "../../order/application/order";
import {InMemoryRepository} from "../integration/in-memory-repository.test";
import {DiscountCodes} from "../../order/domain/constant/discount-code";

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
})