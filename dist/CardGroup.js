"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * CardGroup
 *
 * a group of card objects
 * (typically either a player's hand, or the shared board)
 */
const _ = require("lodash");
const Card_1 = require("./Card");
class CardGroup extends Array {
    constructor() {
        super();
    }
    static fromString(s) {
        const tmp = s.replace(/[^a-z0-9]/gi, '');
        if (tmp.length % 2 !== 0) {
            throw new Error(`Invalid cards: ${s}`);
        }
        const cardgroup = new CardGroup();
        for (let i = 0; i < tmp.length; i = i + 2) {
            cardgroup.push(Card_1.Card.fromString(tmp.substring(i, i + 2)));
        }
        return cardgroup;
    }
    static fromCards(cards) {
        const cardgroup = new CardGroup();
        for (const card of cards) {
            cardgroup.push(card);
        }
        return cardgroup;
    }
    contains(c) {
        for (const card of this) {
            if (card.equals(c)) {
                return true;
            }
        }
        return false;
    }
    toString() {
        return '' + this.join(' ');
    }
    sortCards(cardType) {
        const sorted = _.orderBy(this, ['rank', 'suit'], [cardType, cardType]);
        /* tslint:disable:no-any */
        this.splice.apply(this, [0, this.length].concat(sorted));
    }
    concat(cardgroup) {
        const ret = new CardGroup();
        for (const card of this) {
            ret.push(card);
        }
        for (const card of cardgroup) {
            ret.push(card);
        }
        return ret;
    }
    countBy(cardType) {
        return _.countBy(this, cardType);
    }
}
exports.CardGroup = CardGroup;
//# sourceMappingURL=CardGroup.js.map