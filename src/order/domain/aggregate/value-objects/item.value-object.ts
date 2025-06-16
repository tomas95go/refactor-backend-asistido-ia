export class Item {
    private readonly _value: {
        productId: string;
        quantity: number;
        price: number;
    };

    constructor(item: { productId: string, quantity: number, price: number }) {
        this._value = item;
    }

    get value(): { productId: string; quantity: number; price: number; } {
        return this._value;
    }
}