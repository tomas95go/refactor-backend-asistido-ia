import {DomainError} from "../error/error";

export class Address {
    private constructor(readonly value: string) {
    }

    static create(value: string): Address {
        if (!value || value.trim() === '') {
            throw new DomainError('Address cannot be empty');
        }
        return new Address(value);
    }
}