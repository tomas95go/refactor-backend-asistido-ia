import {Id} from "../value-object/id";
import {OrderLine} from "../value-object/order-line";
import {OrderStatus} from "../constant/status";
import {Address} from "../value-object/address";
import {DiscountCode, DiscountCodes} from "../constant/discount-code";
import {DomainError} from "../error/error";
import {PositiveNumber} from "../value-object/positive-number";

type PersistOrderModel = {
    _id: string;
    items: { productId: string; quantity: number; price: number; }[];
    shippingAddress: string;
    status: OrderStatus,
    discountCode?: DiscountCode
};

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
        if(this.status !== OrderStatus.Created) {
            throw new DomainError(`Cannot complete an order with status: ${this.status}`);
        }
        this.status = OrderStatus.Completed;
    }

    isCompleted() {
        return this.status === OrderStatus.Completed;
    }

    toPersistence() {
        return {
            _id: this.id.value,
            items: this.items.map(item => {
                return {
                    productId: item.productId.value,
                    quantity: item.quantity.value,
                    price: item.price.value,
                }
            }),
            shippingAddress: this.shippingAddress.value,
            status: this.status,
            discountCode: this.discountCode,
            total: this.calculateTotal().value
        }
    }

    toDomain(persisted: PersistOrderModel): Order {
        return new Order(
            Id.from(persisted._id),
            persisted.items.map((item: any) => OrderLine.create(Id.from(item.productId),PositiveNumber.create(item.quantity),PositiveNumber.create(item.price))),
            Address.create(persisted.shippingAddress),
            persisted.status,
            persisted.discountCode);
    }
}