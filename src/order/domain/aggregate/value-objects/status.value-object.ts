export class Status {
    private readonly _value: string;
    constructor(status: string) {
        this._value = status;
    }

    get value(): string {
        return this._value;
    }
}