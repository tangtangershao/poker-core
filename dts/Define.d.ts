import { IRule } from "./Rule";
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
    RIVER = 4,
    SHOWDOWN = 5
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
export declare enum Position {
    sb = 0,
    bb = 1,
    ep = 2,
    mp = 3,
    lp = 4,
    button = 5
}
export declare enum RelactivePosition {
    ep = 0,
    mp = 1,
    lp = 2
}
export interface GameResult {
    pot: number;
    rake: number;
    playerWins: {
        [playerId: string]: number;
    };
    playerCollects: {
        [playerId: string]: number;
    };
}
/**
 * 牌局记录
 */
export declare class History {
    BoardCards: string[];
    playerCards: {
        [playerId: string]: string[];
    };
    rule?: IRule;
    platform: string;
    street: Street;
    players: {
        id: string;
        money: number;
        seat: number;
        misc: {
            [key: string]: any;
        };
    }[];
    buttenPlayerId: string;
    gameId: number;
    startTime: Date;
    actions: Action[];
    stack: Stack;
    playerWins: {
        [playerId: string]: number;
    };
    playerCollects: {
        [playerId: string]: number;
    };
}
/**
 * 牌局记录
 */
export declare class HistoryPlayerOptions {
    playerCards: {
        [playerId: string]: string[];
    };
    rule?: IRule;
    platform: string;
    players: {
        id: string;
        money: number;
        seat: number;
        misc: {
            [key: string]: any;
        };
    }[];
    buttenPlayerId: string;
    gameId: number;
    startTime: Date;
    stack: Stack;
}
export declare class PlayerStatus {
    playerId: number;
    money: number;
    seat: number;
    isMyTurn: boolean;
    position: Position;
    relactivePosition: RelactivePosition;
    miniRaiseAmount?: number;
}
export declare class StreetStatus {
    street: Street;
    playerCount: number;
    players: number[];
    pot: number[];
    potTotal: number;
    lastBet: number;
}
