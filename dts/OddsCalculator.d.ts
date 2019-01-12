import { CardGroup } from './CardGroup';
import { HandRank } from './HandRank';
export declare class HandEquity {
    protected possibleHandsCount: number;
    protected bestHandCount: number;
    protected tieHandCount: number;
    constructor();
    addPossibility(isBestHand: boolean, isTie: boolean): void;
    getEquity(): number;
    getTiePercentage(): number;
    toString(): string;
}
export declare class OddsCalculator {
    static DEFAULT_ITERATIONS: number;
    equities: HandEquity[];
    protected odds: number[];
    protected handranks: HandRank[];
    protected iterations: number;
    protected elapsedTime: number;
    protected constructor(equities: HandEquity[], handranks: HandRank[], iterations: number, elapsedTime: number);
    static calculate(cardgroups: CardGroup[], board?: CardGroup, gameVariant?: string, iterations?: number): OddsCalculator;
    getIterationCount(): number;
    getElapsedTime(): number;
    getHandRank(index: number): HandRank;
}
