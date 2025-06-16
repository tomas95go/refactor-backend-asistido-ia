// Domain
import { OrderAggregate } from "../aggregate/order.aggregate";
import { Id } from "../aggregate/value-objects";

export interface IOrderRepository {
    findById(id: Id): Promise<OrderAggregate | null>;
    findAll(): Promise<OrderAggregate[]>;
    save(orderAggregate: OrderAggregate): Promise<OrderAggregate>;
    update(orderAggregate: OrderAggregate): Promise<OrderAggregate>;
    deleteById(id: Id): Promise<void>;
}