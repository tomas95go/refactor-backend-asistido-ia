export class Total {
    private readonly _value: number;
    constructor(total: number) {
        this._value = total;
    }

    get value(): number {
        return this._value;
    }

    static calculateTotal(items: { productId: string, quantity: number, price: number }[], discountMultiplier: number): number {
        const subTotal: number = items.reduce((accumulator: any, item: any) =>  accumulator + (item.price || 0) * (item.quantity || 0), 0);
        return subTotal * discountMultiplier;
    }
}