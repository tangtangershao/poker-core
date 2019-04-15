import { IRule } from './Rule';
import { CardGroup } from './CardGroup';
import { Card } from '.';
export default class Dealer {
    private rule;
    private allCards;
    private boardCards;
    private playerCards;
    private isDealAll;
    /**
     *
     */
    constructor(rule: IRule);
    /**
     * shuffle the cards
     * will clean the dealt history
     */
    shuffle(): void;
    /**
     * get all five board cards
     * @throws NotBeenDealtError
     */
    getBoardCards(): CardGroup;
    /**
     * get hole cards that dealt to all players
     * can only be executed after deal()
     * @returns {{[playerId: string]: CardGroup;}}
     * @throws NotBeenDealtError
     * @memberof Dealer
     */
    getDealtCards(): {
        [playerId: string]: CardGroup;
    };
    /**
     * deal hole cards to all players
     * can only be executed once after shuffle()
     * @param {string[]} playerIds
     * @throws HadBeenDealtError
     */
    dealAll(playerIds: string[]): void;
    setBoardCards(cards?: Card[]): void;
    setFlopCards(cards?: Card[]): void;
    setTurnCard(card?: Card): void;
    setRiverCard(card?: Card): void;
    private resetCards;
}
export declare class NotBeenDealtError extends Error {
}
export declare class HadBeenDealtError extends Error {
}
