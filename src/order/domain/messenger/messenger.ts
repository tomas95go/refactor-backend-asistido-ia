import {Order} from "../aggregate/order";

export interface Messenger {
    send(data: { to: string, order: Order }): Promise<string>;
}