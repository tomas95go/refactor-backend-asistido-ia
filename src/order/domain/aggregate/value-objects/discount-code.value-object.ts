export class DiscountCode {
    private readonly _value: string;

    constructor(discountCode: string) {
        this._value = discountCode;
    }

    get value(): string {
        return this._value;
    }
}