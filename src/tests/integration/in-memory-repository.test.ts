import {OrderRepository} from "../../order/domain/repository/repository";
import {Id} from "../../order/domain/value-object/id";
import {Order} from "../../order/domain/aggregate/order";
import {OrderLine} from "../../order/domain/value-object/order-line";
import {Address} from "../../order/domain/value-object/address";
import {PositiveNumber} from "../../order/domain/value-object/positive-number";

export class InMemoryRepository implements OrderRepository  {

    private orders: Order[] = [];

    static create(): InMemoryRepository {
        return new InMemoryRepository();
    }

    async findById(id: Id): Promise<Order | null> {
        const order: Order | undefined = this.orders.find(order => order.getId().value === id.value);
        if (!order) {
            return null;
        }
        return order;
    };

    async findAll(): Promise<Order[] | []> {
        return this.orders;
    };

    async save(order: Order): Promise<void> {
        this.orders.push(order);
    };

    async delete(id: Id): Promise<void> {
        const orderIndex = this.orders.findIndex(order => order.getId() === id);
        this.orders.splice(orderIndex, 1);
    };

    reset() {
        this.orders = [];
    }
}

describe('Order repository (in memory) methods', () => {

    let repository: InMemoryRepository;

    beforeAll(() => {
        repository = InMemoryRepository.create();
    });

    beforeEach(() => {
        repository.reset();
    });

    it('Should save a new order', async () => {
        // Arrange
        const shippingAddressPrimitives = 'Avenida siempreviva 101';
        const orderItemsPrimitives = [{
            productId: '32aba416-8455-4018-82c4-d56253c152e9',
            quantity: 2,
            price: 200
        }];
        const shippingAddress: Address = Address.create(shippingAddressPrimitives);
        const orderItems: OrderLine[]= orderItemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price),));
        const order: Order = Order.create(orderItems, shippingAddress);
        // Act
        await repository.save(order);
        // Assert
        const savedOrders: Order[] | [] = await repository.findAll();
        const savedOrder: Order = savedOrders[0];
        expect(savedOrder.toDto().items[0].productId).toBe(orderItemsPrimitives[0].productId);
        expect(savedOrder.toDto().items[0].quantity).toBe(orderItemsPrimitives[0].quantity);
        expect(savedOrder.toDto().items[0].price).toBe(orderItemsPrimitives[0].price);
        expect(savedOrder.toDto().shippingAddress).toBe(shippingAddressPrimitives);
    });

    it('Should get all orders', async () => {
        // Arrange
        const shippingAddressPrimitives = 'Avenida siempreviva 101';
        const orderItemsPrimitives = [{
            productId: '32aba416-8455-4018-82c4-d56253c152e9',
            quantity: 2,
            price: 200
        }];
        const shippingAddress: Address = Address.create(shippingAddressPrimitives);
        const orderItems: OrderLine[]= orderItemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price),));
        const order: Order = Order.create(orderItems, shippingAddress);
        // Act
        await repository.save(order);
        // Assert
        const savedOrders: Order[] | [] = await repository.findAll();
        expect(savedOrders).toHaveLength(1);
    });

    it('Should get an order by id', async () => {
        // Arrange
        const shippingAddressPrimitives = 'Avenida siempreviva 101';
        const orderItemsPrimitives = [{
            productId: '32aba416-8455-4018-82c4-d56253c152e9',
            quantity: 2,
            price: 200
        }];
        const shippingAddress: Address = Address.create(shippingAddressPrimitives);
        const orderItems: OrderLine[]= orderItemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price),));
        const order: Order = Order.create(orderItems, shippingAddress);
        // Act
        await repository.save(order);
        // Assert
        const savedOrder: Order | null = await repository.findById(order.getId());
        expect(savedOrder?.getId()).toBe(order.getId());
    });

    it('Should delete an order by id', async () => {
        // Arrange
        const shippingAddressPrimitives = 'Avenida siempreviva 101';
        const orderItemsPrimitives = [{
            productId: '32aba416-8455-4018-82c4-d56253c152e9',
            quantity: 2,
            price: 200
        }];
        const shippingAddress: Address = Address.create(shippingAddressPrimitives);
        const orderItems: OrderLine[]= orderItemsPrimitives.map(item => OrderLine.create(Id.from(item.productId), PositiveNumber.create(item.quantity), PositiveNumber.create(item.price),));
        const order: Order = Order.create(orderItems, shippingAddress);
        await repository.save(order);
        // Act
        await repository.delete(order.getId());
        // Assert
        const savedOrders: Order[] | [] = await repository.findAll();
        expect(savedOrders.length).toBe(0);
    });

});