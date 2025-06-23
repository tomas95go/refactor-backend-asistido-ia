import {Id} from "./id";
import {PositiveNumber} from "./positive-number";

export class OrderLine {
    private constructor(
        readonly productId: Id,
        readonly quantity: PositiveNumber,
        readonly price: PositiveNumber
    ) {}

    static create(productId: string, quantity: number, price: number): OrderLine {
        return new OrderLine(Id.from(productId), PositiveNumber.create(quantity), PositiveNumber.create(price));
    }

    calculateSubTotal(): PositiveNumber {
        return this.quantity.multiply(this.price);
    }
}