/**
 * Card, Rank, and Suit classes
 */
export interface ICardName {
    singular: string;
    plural: string;
}
export declare class Suit {
    static CLUB: number;
    static DIAMOND: number;
    static HEART: number;
    static SPADE: number;
    static all(): number[];
    static fromString(s: string): number;
}
export declare class Rank {
    static TWO: number;
    static THREE: number;
    static FOUR: number;
    static FIVE: number;
    static SIX: number;
    static SEVEN: number;
    static EIGHT: number;
    static NINE: number;
    static TEN: number;
    static JACK: number;
    static QUEEN: number;
    static KING: number;
    static ACE: number;
    static names: ICardName[];
    static fromString(s: string): number;
    all(): number[];
}
export declare class Card {
    protected rank: number;
    protected suit: number;
    constructor(rank: number, suit: number);
    static fromString(s: string): Card;
    getRank(): number;
    getSuit(): number;
    equals(c: Card): boolean;
    toString(suit?: boolean, full?: boolean, plural?: boolean): string;
}
