import {Id} from "./id";
import {PositiveNumber} from "./positive-number";

export class OrderLine {
    private constructor(
        readonly productId: Id,
        readonly quantity: PositiveNumber,
        readonly price: PositiveNumber
    ) {}

    static create(productId: Id, quantity: PositiveNumber, price: PositiveNumber): OrderLine {
        return new OrderLine(productId, quantity, price);
    }

    calculateSubTotal(): PositiveNumber {
        return this.quantity.multiply(this.price);
    }
}