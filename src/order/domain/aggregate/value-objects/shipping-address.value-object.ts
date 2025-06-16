export class ShippingAddress {
    private readonly _value: string;
    constructor(shippingAddress: string) {
        this._value = shippingAddress;
    }

    get value(): string {
        return this._value;
    }
}