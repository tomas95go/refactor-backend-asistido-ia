export class Status {
    private readonly _value: string;
    static readonly _statuses: Map<string, string> = new Map<string, string>([
        ['CREATED', 'CREATED'],
        ['CONFIRMED', 'CONFIRMED'],
        ['COMPLETED', 'COMPLETED']
    ]);
    static readonly _validStatusTransition: Map<string, boolean> = new Map<string, boolean>([
        [JSON.stringify({ from: '', to: 'CREATED' }), true],
        [JSON.stringify({ from: 'CREATED', to: 'CONFIRMED' }), true],
        [JSON.stringify({ from: 'CONFIRMED', to: 'COMPLETED' }), true]
    ])

    constructor(status: string) {
        this._value = status;
    }

    get value(): string {
        return this._value;
    }

    static create(): string {
        const createdStatus = this._statuses.get('CREATED');

        if(!createdStatus) {
            return 'CREATED';
        }

        return createdStatus;
    }

    static confirm(): string {
        const confirmedStatus = this._statuses.get('CONFIRMED');

        if(!confirmedStatus) {
            return 'CONFIRMED';
        }

        return confirmedStatus;
    }

    static complete(): string {
        const completedStatus = this._statuses.get('COMPLETED');

        if(!completedStatus) {
            return 'COMPLETED';
        }

        return completedStatus;
    }

    static validateStatusTransition(dto: { from: string, to: string }): boolean {
        const INVALID_STATUS_TRANSITION = false;

        const validStatusTransition = this._validStatusTransition.get(JSON.stringify({ from: dto.from, to: dto.to }));

        if(!validStatusTransition) {
            return INVALID_STATUS_TRANSITION;
        }

        return validStatusTransition;
    }
}