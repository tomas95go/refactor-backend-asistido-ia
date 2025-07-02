import {DomainError} from "../error/error";

export class PositiveNumber {
    private constructor(readonly value: number) {}

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new DomainError('Negative numbers are not allowed');
        }

        return new PositiveNumber(value);
    }

    multiply(number: PositiveNumber): PositiveNumber {
        return PositiveNumber.create(this.value * number.value);
    }

    add(number: PositiveNumber): PositiveNumber {
        return PositiveNumber.create(this.value + number.value);
    }
}