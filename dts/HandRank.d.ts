import { Card } from './Card';
import { CardGroup } from './CardGroup';
import { IGame } from './Game';
export declare class HandRankAlias {
    static HIGH_CARD: string;
    static PAIR: string;
    static TWO_PAIRS: string;
    static TRIPS: string;
    static STRAIGHT: string;
    static FLUSH: string;
    static FULL_HOUSE: string;
    static QUADS: string;
    static STRAIGHT_FLUSH: string;
}
export declare class HandRank {
    protected alias: string;
    protected rank: number;
    protected highcards: Card[];
    protected constructor(rank: number, alias: string, highcards: Card[]);
    static evaluate(game: IGame, cardgroup: CardGroup): HandRank;
    getHighCards(): Card[];
    getRank(): number;
    compareTo(handrank: HandRank): number;
    toString(): string;
}
