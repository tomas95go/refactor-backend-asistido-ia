export class DiscountCode {
    private readonly _value: string;
    static readonly _discountCodes: Map<string, number> = new Map<string, number>([
        ['DISCOUNT20', 0.8]
    ]);

    constructor(discountCode: string) {
        this._value = discountCode;
    }

    get value(): string {
        return this._value;
    }

    static getDiscountMultiplier(discountCode: string | undefined): number {
        const NO_DISCOUNT = 1;

        if(!discountCode) {
            return NO_DISCOUNT;
        }

        const discountMultiplier = this._discountCodes.get(discountCode);

        if(!discountMultiplier) {
            return NO_DISCOUNT;
        }

        return discountMultiplier;
    }
}