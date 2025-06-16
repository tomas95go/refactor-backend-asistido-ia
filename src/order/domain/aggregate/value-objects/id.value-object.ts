export class Id {
    private readonly _value: string;
    constructor(id: string) {
        this._value = id;
    }

    get value(): string {
        return this._value;
    }
}