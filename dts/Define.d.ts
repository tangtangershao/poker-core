export declare enum ActionType {
    BET = 1,
    CALL = 2,
    RAISE = 3,
    ALLIN = 4,
    FOLD = 5,
    CHECK = 6,
    SB = 7,
    BB = 8
}
export declare enum Street {
    PREFLOP = 1,
    FLOP = 2,
    TURN = 3,
    RIVER = 4
}
export declare class Action {
    type: ActionType;
    amount?: number;
    street: Street;
    time: Date;
    playerId: string;
    /**
     *
     */
    constructor();
}
export declare class Stack {
    sb: number;
    bb: number;
    currency: string;
}
