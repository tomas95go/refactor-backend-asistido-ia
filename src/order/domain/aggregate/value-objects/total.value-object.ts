export class Total {
    private readonly _value: number;
    constructor(total: number) {
        this._value = total;
    }

    get value(): number {
        return this._value;
    }
}