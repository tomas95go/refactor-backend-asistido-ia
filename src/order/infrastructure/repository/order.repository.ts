// Domain
import { IOrderRepository } from "../../domain/repository/order.interface-repository";
import { OrderAggregate } from "../../domain/aggregate/order.aggregate";
import { Id } from "../../domain/aggregate/value-objects";
import {OrderDocumentPersistenceEntity} from "../persistence/order.document-persistence";

export class OrderRepository implements IOrderRepository {

    async findById(id: Id): Promise<OrderAggregate | null> {
        const order = await OrderDocumentPersistenceEntity.findById(id.value);
        return order ? new OrderAggregate(order) : null;
    }

    async findAll(): Promise<OrderAggregate[]> {
        // Get all orders from persistence model
        const orders = await OrderDocumentPersistenceEntity.find();

        // Build aggregates with persisted orders
        return orders.length ? orders.map(order => new OrderAggregate(order)) : [];
    }

    async save(orderAggregate: OrderAggregate): Promise<OrderAggregate> {
        // Convert to persistence model
        const order = OrderAggregate.toPersistence(orderAggregate);

        // Generate new order document and save it to database
        const newOrder = new OrderDocumentPersistenceEntity(order);
        await newOrder.save();

        // Return persisted aggregate
        return new OrderAggregate(newOrder);
    }

    async update(orderAggregate: OrderAggregate): Promise<OrderAggregate> {
        // Convert to persistence model
        const order = OrderAggregate.toPersistence(orderAggregate);

        const updatedOrder = await OrderDocumentPersistenceEntity.findOneAndUpdate({ _id: order.id }, { $set: order });

        // Build aggregate with persisted order
        return new OrderAggregate(updatedOrder!);
    }

    async deleteById(id: Id): Promise<void> {
        await OrderDocumentPersistenceEntity.findByIdAndDelete(id.value);
    }

}