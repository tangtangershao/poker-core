/**
 * Game Variant Specfic Classes
 */
import { Rank } from './Card';
/**
 * GameRules base class
 */
export interface IGame {
    HIGH_CARD: number;
    PAIR: number;
    TWO_PAIRS: number;
    TRIPS: number;
    STRAIGHT: number;
    FLUSH: number;
    FULL_HOUSE: number;
    QUADS: number;
    STRAIGHT_FLUSH: number;
    FLUSH_BEATS_FULLHOUSE: boolean;
    A6789_STRAIGHT: boolean;
    A2345_STRAIGHT: boolean;
    rank: Rank;
}
export declare class FullDeckRank extends Rank {
    all(): number[];
}
export declare class FullDeckGame implements IGame {
    HIGH_CARD: number;
    PAIR: number;
    TWO_PAIRS: number;
    TRIPS: number;
    STRAIGHT: number;
    FLUSH: number;
    FULL_HOUSE: number;
    QUADS: number;
    STRAIGHT_FLUSH: number;
    FLUSH_BEATS_FULLHOUSE: boolean;
    A6789_STRAIGHT: boolean;
    A2345_STRAIGHT: boolean;
    rank: Rank;
    constructor();
}
export declare class ShortDeckRank extends Rank {
    all(): number[];
}
export declare class ShortDeckGame implements IGame {
    HIGH_CARD: number;
    PAIR: number;
    TWO_PAIRS: number;
    TRIPS: number;
    STRAIGHT: number;
    FLUSH: number;
    FULL_HOUSE: number;
    QUADS: number;
    STRAIGHT_FLUSH: number;
    FLUSH_BEATS_FULLHOUSE: boolean;
    A6789_STRAIGHT: boolean;
    A2345_STRAIGHT: boolean;
    rank: Rank;
    constructor();
}
