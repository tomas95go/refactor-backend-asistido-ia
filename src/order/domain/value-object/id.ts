import { v4 as uuid } from 'uuid';

export class Id {
    private constructor(readonly value: string) {}

    static create(): Id {
        return new Id(uuid());
    }
}