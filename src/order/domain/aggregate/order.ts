import {Id} from "../value-object/id";
import {OrderLine} from "../value-object/order-line";
import {OrderStatus} from "../constant/status";
import {Address} from "../value-object/address";
import {DiscountCode} from "../constant/discount-code";

export class Order {
    private constructor(
        readonly id: Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        readonly status: OrderStatus,
        readonly discountCode?: DiscountCode
    ) {}

    static create(
        items: OrderLine[],
        shippingAddress: Address,
        discountCode?: DiscountCode,
    ): Order {
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }
}