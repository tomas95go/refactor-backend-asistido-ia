import {Id} from "../value-object/id";
import {OrderLine} from "../value-object/order-line";
import {OrderStatus} from "../constant/status";
import {Address} from "../value-object/address";
import {DiscountCode, DiscountCodes} from "../constant/discount-code";
import {DomainError} from "../error/error";
import {PositiveNumber} from "../value-object/positive-number";

export class Order {
    private constructor(
        readonly id: Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        private status: OrderStatus,
        readonly discountCode?: DiscountCode
    ) {}

    static create(items: OrderLine[], shippingAddress: Address, discountCode?: DiscountCode): Order {
        if(items.length === 0) {
            throw new DomainError('The order must have at least one item');
        }
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }

    calculateTotal(): PositiveNumber {
        const total: PositiveNumber = this.items.reduce((total, item) => total.add(item.calculateSubTotal()), PositiveNumber.create(0));
        return this.applyDiscount(total);
    }

    applyDiscount(total: PositiveNumber): PositiveNumber {
        if(this.discountCode === DiscountCodes.DISCOUNT20) {
            return total.multiply(PositiveNumber.create(0.8));
        }
        return total;
    }

    complete() {
        this.status = OrderStatus.Completed;
    }

    isCompleted() {
        return this.status === OrderStatus.Completed;
    }
}