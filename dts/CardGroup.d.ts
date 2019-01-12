import { Card } from './Card';
export declare class CardGroup extends Array {
    constructor();
    static fromString(s: string): CardGroup;
    static fromCards(cards: Card[]): CardGroup;
    contains(c: Card): boolean;
    toString(): string;
    sortCards(cardType: 'asc' | 'desc'): void;
    concat(cardgroup: CardGroup): CardGroup;
    countBy(cardType: string): {
        [x: string]: number;
    };
}
