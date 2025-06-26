import {Order} from "../aggregate/order";
import {Id} from "../value-object/id";

export interface OrderRepository {
    findById(id: Id): Promise<Order | null>;
    findAll(): Promise<Order[] | []>;
    save(order: Order): Promise<void>;
    delete(id: Id): Promise<void>;
}