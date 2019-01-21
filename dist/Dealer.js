"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const Card_1 = require("./Card");
const lodash_1 = require("lodash");
class Dealer {
    /**
     *
     */
    constructor(rule) {
        this.isDealAll = false;
        this.rule = rule;
    }
    /**
     * shuffle the cards
     * will clean the dealt history
     */
    shuffle() {
        this.boardCards = null;
        this.playerCards = null;
        this.isDealAll = false;
        this.resetCards();
    }
    /**
     * get all five board cards
     */
    getBoardCards() {
        return this.boardCards;
    }
    /**
     * get hole cards that dealt to all players
     * can only be executed after deal()
     * @returns {{[playerId: string]: CardGroup;}}
     * @throws NotBeenDealtError
     * @memberof Dealer
     */
    getDealtCards() {
        if (!this.isDealAll) {
            throw new NotBeenDealtError();
        }
        return this.playerCards;
        // return { '123456': CardGroup.fromCards([new Card(1,1),new Card(1,2)]) }
    }
    /**
     * deal hole cards to all players
     * can only be executed once after shuffle()
     * @param {string[]} playerIds
     * @throws HadBeenDealtError
     */
    dealAll(playerIds) {
        if (this.isDealAll) {
            throw new HadBeenDealtError();
        }
        let cardCount = 0;
        for (let playerId of playerIds) {
            let cardGroup;
            cardGroup.push(this.allCards[cardCount]);
            cardCount += 1;
            cardGroup.push(this.allCards[cardCount]);
            cardCount += 1;
            this.playerCards[playerId] = cardGroup;
        }
        for (let i = 0; i < 5; i++) {
            this.boardCards.push(this.allCards[cardCount]);
            cardCount += 1;
        }
        this.isDealAll = true;
    }
    resetCards() {
        this.allCards = null;
        if (this.rule.A6789_STRAIGHT) {
            for (let i = 1; i < 5; i++) {
                let suit = i;
                this.allCards.push(new _1.Card(Card_1.Rank.ACE, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.TWO, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.THREE, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.FOUR, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.FIVE, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.SIX, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.SEVEN, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.EIGHT, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.NINE, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.TEN, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.JACK, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.QUEEN, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.KING, suit));
            }
        }
        if (this.rule.A2345_STRAIGHT) {
            for (let i = 1; i < 5; i++) {
                let suit = i;
                this.allCards.push(new _1.Card(Card_1.Rank.ACE, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.SIX, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.SEVEN, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.EIGHT, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.NINE, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.TEN, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.JACK, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.QUEEN, suit));
                this.allCards.push(new _1.Card(Card_1.Rank.KING, suit));
            }
        }
        for (let i = this.allCards.length - 1; i > 0; i--) {
            let rand = lodash_1.random(0, i, false);
            let temp = this.allCards[i];
            this.allCards[i] = this.allCards[rand];
            this.allCards[rand] = temp;
        }
    }
}
exports.default = Dealer;
class NotBeenDealtError extends Error {
}
class HadBeenDealtError extends Error {
}
//# sourceMappingURL=Dealer.js.map