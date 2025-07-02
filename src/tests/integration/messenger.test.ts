import {Messenger} from "../../order/domain/messenger/messenger";
import {Order} from "../../order/domain/aggregate/order";
import {OrderLine} from "../../order/domain/value-object/order-line";
import {Id} from "../../order/domain/value-object/id";
import {PositiveNumber} from "../../order/domain/value-object/positive-number";
import {Address} from "../../order/domain/value-object/address";

export class InMemoryMessenger implements Messenger {

    static create(): InMemoryMessenger {
        return new InMemoryMessenger();
    }

    async send(data: { to: string; order: Order; }): Promise<string> {
        const orderDto = data.order.toDto();

        return `Your order: ${orderDto.id} has been completed!`
    }
}

describe('Order notification email sender methods', () => {
    let inMemoryMessenger: InMemoryMessenger;

    beforeAll(() => {
        inMemoryMessenger = InMemoryMessenger.create();
    });

    it('Should notify an user that an order has been completed', async () => {
        // Arrange
        const itemsPrimitives = [{
            productId: '8259dff2-4bf5-41da-b9b4-010b76988b30',
            price: 100,
            quantity: 2
        }];
        const addressPrimitive = 'Avenida Siempreviva 100';

        const items: OrderLine[] = itemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price)));
        const shippingAddress: Address = Address.create(addressPrimitive);
        const order: Order = Order.create(items, shippingAddress);
        order.complete();
        // Act
        const providerResponse = await inMemoryMessenger.send({ to: 'recipient', order });
        // Assert
        expect(providerResponse).toBe(`Your order: ${order.getId().value} has been completed!`);
    });
});