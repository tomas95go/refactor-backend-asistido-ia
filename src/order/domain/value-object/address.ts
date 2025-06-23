export class Address {
    private constructor(readonly value: string) {
    }

    static create(value: string): Address {
        if (!value) {
            throw new Error('Address cannot be empty');
        }
        return new Address(value);
    }
}