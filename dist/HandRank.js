"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * HandRank
 */
const _ = require("lodash");
const Card_1 = require("./Card");
class HandRankAlias {
}
HandRankAlias.HIGH_CARD = 'HIGH_CARD';
HandRankAlias.PAIR = 'PAIR';
HandRankAlias.TWO_PAIRS = 'TWO_PAIRS';
HandRankAlias.TRIPS = 'TRIPS';
HandRankAlias.STRAIGHT = 'STRAIGHT';
HandRankAlias.FLUSH = 'FLUSH';
HandRankAlias.FULL_HOUSE = 'FULL_HOUSE';
HandRankAlias.QUADS = 'QUADS';
HandRankAlias.STRAIGHT_FLUSH = 'STRAIGHT_FLUSH';
exports.HandRankAlias = HandRankAlias;
class HandRank {
    constructor(rank, alias, highcards) {
        this.rank = rank;
        this.alias = alias;
        this.highcards = highcards;
    }
    static evaluate(game, cardgroup) {
        cardgroup.sortCards('desc');
        // Group card by ranks
        const countByRanks = cardgroup.countBy('rank');
        const quadRanks = [];
        const tripRanks = [];
        const pairRanks = [];
        let straightCardsCount = 0;
        let straightMaxCardRank = 0;
        let straightLastCardRank = 0;
        const allRanks = Object.keys(countByRanks).reverse();
        for (const rank of allRanks) {
            if (countByRanks[rank] === 2) {
                pairRanks.push(Number(rank));
            }
            else if (countByRanks[rank] === 3) {
                tripRanks.push(Number(rank));
            }
            else if (countByRanks[rank] === 4) {
                quadRanks.push(Number(rank));
            }
            if (straightCardsCount !== 5) {
                if (straightLastCardRank === 0 || straightLastCardRank - 1 !== Number(rank)) {
                    straightMaxCardRank = straightLastCardRank = Number(rank);
                    straightCardsCount = 1;
                }
                else {
                    straightCardsCount += 1;
                    straightLastCardRank = Number(rank);
                }
            }
        }
        // Group card by suit
        const countBySuits = cardgroup.countBy('suit');
        let flushSuit = 0;
        _.some(Object.keys(countBySuits), (suit) => {
            if (countBySuits[suit] >= 5) {
                flushSuit = Number(suit);
                return true;
            }
            return false;
        });
        // Straight flush
        if (flushSuit > 0) {
            if (straightCardsCount >= 5) {
                const straightFlushCards = _.filter(cardgroup, (card) => {
                    return card.getSuit() === flushSuit && card.getRank() <= straightMaxCardRank;
                });
                if (straightFlushCards.length >= 5) {
                    let isStraightFlush = true;
                    for (let i = 1; i <= 4; i += 1) {
                        if (straightFlushCards[i].getRank() !== straightFlushCards[i - 1].getRank() - 1) {
                            isStraightFlush = false;
                            break;
                        }
                    }
                    if (isStraightFlush) {
                        return new HandRank(game.STRAIGHT_FLUSH, HandRankAlias.STRAIGHT_FLUSH, straightFlushCards.slice(0, 5));
                    }
                }
                else if (straightFlushCards.length === 4 &&
                    (
                    // Five high straight (5-4-3-2-A)
                    (game.A2345_STRAIGHT && straightFlushCards[0].getRank() === Card_1.Rank.FIVE) ||
                        // Five high straight (9-8-7-6-A)
                        (game.A6789_STRAIGHT && straightFlushCards[0].getRank() === Card_1.Rank.NINE))) {
                    const aceCards = _.filter(cardgroup, (card) => {
                        return card.getSuit() === flushSuit && card.getRank() === Card_1.Rank.ACE;
                    });
                    if (aceCards.length) {
                        return new HandRank(game.STRAIGHT_FLUSH, HandRankAlias.STRAIGHT_FLUSH, straightFlushCards.concat(aceCards[0]));
                    }
                }
            }
            else if (straightCardsCount === 4 &&
                (
                // Five high straight (5-4-3-2-A)
                (game.A2345_STRAIGHT && straightMaxCardRank === Card_1.Rank.FIVE) ||
                    // Nine high straight (9-8-7-6-A)
                    (game.A6789_STRAIGHT && straightMaxCardRank === Card_1.Rank.NINE))) {
                const aceCards = _.filter(cardgroup, (card) => {
                    return card.getSuit() === flushSuit && card.getRank() === Card_1.Rank.ACE;
                });
                if (aceCards.length > 0) {
                    const straightFlushCards = _.filter(cardgroup, (card) => {
                        return card.getSuit() === flushSuit && card.getRank() <= straightMaxCardRank;
                    });
                    if (straightFlushCards.length === 4) {
                        return new HandRank(game.STRAIGHT_FLUSH, HandRankAlias.STRAIGHT_FLUSH, straightFlushCards.concat(aceCards[0]).slice(0, 5));
                    }
                }
            }
        }
        // Quads
        if (quadRanks.length === 1) {
            const quadCards = _.filter(cardgroup, (card) => card.getRank() === quadRanks[0]);
            const cards = _.reject(cardgroup, (card) => card.getRank() === quadRanks[0]);
            return new HandRank(game.QUADS, HandRankAlias.QUADS, quadCards.concat(cards).slice(0, 5));
        }
        // Full house
        if (tripRanks.length === 1 && pairRanks.length >= 1) {
            const tripCards = _.filter(cardgroup, (card) => {
                return card.getRank() === tripRanks[0];
            });
            const pairCards = _.filter(cardgroup, (card) => {
                return card.getRank() === pairRanks[0];
            });
            return new HandRank(game.FULL_HOUSE, HandRankAlias.FULL_HOUSE, tripCards.concat(pairCards));
        }
        else if (tripRanks.length > 1) {
            const tripCards = _.filter(cardgroup, (card) => {
                return card.getRank() === tripRanks[0];
            });
            const pairCards = _.filter(cardgroup, (card) => {
                return card.getRank() === tripRanks[1];
            });
            return new HandRank(game.FULL_HOUSE, HandRankAlias.FULL_HOUSE, tripCards.concat(pairCards.slice(0, 2)));
        }
        // Flush
        if (flushSuit > 0) {
            const flushCards = _.filter(cardgroup, (card) => {
                return card.getSuit() === flushSuit;
            });
            return new HandRank(game.FLUSH, HandRankAlias.FLUSH, flushCards.slice(0, 5));
        }
        // Straight
        if (straightCardsCount === 5) {
            const straightCards = _.uniqWith(_.filter(cardgroup, (card) => {
                return card.getRank() <= straightMaxCardRank;
            }), (c1, c2) => {
                return c1.getRank() === c2.getRank();
            });
            return new HandRank(game.STRAIGHT, HandRankAlias.STRAIGHT, straightCards.slice(0, 5));
        }
        else if (straightCardsCount === 4 &&
            (
            // Five high straight (5-4-3-2-A)
            (game.A2345_STRAIGHT && straightMaxCardRank === Card_1.Rank.FIVE) ||
                // Five high straight (9-8-7-6-A)
                (game.A6789_STRAIGHT && straightMaxCardRank === Card_1.Rank.NINE))) {
            const aceCards = _.filter(cardgroup, (card) => {
                return card.getRank() === Card_1.Rank.ACE;
            });
            if (aceCards.length > 0) {
                const straightCards = _.uniqWith(_.filter(cardgroup, (card) => {
                    return card.getRank() <= straightMaxCardRank;
                }), (c1, c2) => {
                    return c1.getRank() === c2.getRank();
                });
                return new HandRank(game.STRAIGHT, HandRankAlias.STRAIGHT, straightCards.concat(aceCards[0]).slice(0, 5));
            }
        }
        // Trips
        if (tripRanks.length === 1) {
            const tripCards = _.filter(cardgroup, (card) => {
                return card.getRank() === tripRanks[0];
            });
            const cards = _.reject(cardgroup, (card) => {
                return card.getRank() === tripRanks[0];
            });
            return new HandRank(game.TRIPS, HandRankAlias.TRIPS, tripCards.concat(cards).slice(0, 5));
        }
        // Two pairs
        if (pairRanks.length >= 2) {
            const pairedHigherCards = _.filter(cardgroup, (card) => {
                return card.getRank() === pairRanks[0];
            });
            const pairedLowerCards = _.filter(cardgroup, (card) => {
                return card.getRank() === pairRanks[1];
            });
            const unpairedCards = _.reject(_.reject(cardgroup, (card) => card.getRank() === pairRanks[0]), (card) => card.getRank() === pairRanks[1]);
            return new HandRank(game.TWO_PAIRS, HandRankAlias.TWO_PAIRS, pairedHigherCards.concat(pairedLowerCards)
                .concat(unpairedCards)
                .slice(0, 5));
        }
        // One pair
        if (pairRanks.length === 1) {
            const pairedCards = _.filter(cardgroup, (card) => {
                return card.getRank() === pairRanks[0];
            });
            const unpairedCards = _.reject(cardgroup, (card) => {
                return card.getRank() === pairRanks[0];
            });
            return new HandRank(game.PAIR, HandRankAlias.PAIR, pairedCards.concat(unpairedCards).slice(0, 5));
        }
        // High card
        return new HandRank(game.HIGH_CARD, HandRankAlias.HIGH_CARD, cardgroup.slice(0, 5));
    }
    getHighCards() {
        return this.highcards;
    }
    getRank() {
        return this.rank;
    }
    compareTo(handrank) {
        if (this.getRank() === handrank.getRank()) {
            for (let i = 0; i < 5; i += 1) {
                if (this.getHighCards()[i].getRank() !== handrank.getHighCards()[i].getRank()) {
                    return this.getHighCards()[i].getRank() > handrank.getHighCards()[i].getRank() ? 1 : -1;
                }
            }
            return 0;
        }
        return this.getRank() > handrank.getRank() ? 1 : -1;
    }
    toString() {
        let showHighcards = 0;
        let s = '';
        switch (this.alias) {
            case HandRankAlias.STRAIGHT_FLUSH:
                if (this.highcards[0].getRank() === Card_1.Rank.ACE) {
                    s = 'Royal flush';
                }
                else {
                    s = _.capitalize(this.highcards[0].toString(false, true)) + ' high straight flush';
                }
                break;
            case HandRankAlias.QUADS:
                s = 'Quad ' + this.highcards[0].toString(false, true, true);
                showHighcards = 1;
                break;
            case HandRankAlias.FULL_HOUSE:
                s = `Full house: ${this.highcards[0].toString(false, true, true)} full of ${this.highcards[4].toString(false, true, true)}`;
                break;
            case HandRankAlias.FLUSH:
                s = _.capitalize(this.highcards[0].toString(false, true)) + ' high flush';
                break;
            case HandRankAlias.STRAIGHT:
                s = _.capitalize(this.highcards[0].toString(false, true)) + ' high straight';
                break;
            case HandRankAlias.TRIPS:
                s = `Trip ${this.highcards[0].toString(false, true, true)}`;
                showHighcards = 2;
                break;
            case HandRankAlias.TWO_PAIRS:
                s = `Two pairs: ${this.highcards[0].toString(false, true, true)} and ${this.highcards[2].toString(false, true, true)}`;
                showHighcards = 1;
                break;
            case HandRankAlias.PAIR:
                s = `Pair of ${this.highcards[0].toString(false, true, true)}`;
                showHighcards = 3;
                break;
            default:
                s = 'High card';
                showHighcards = 5;
                break;
        }
        if (showHighcards > 0) {
            const highcards = this.highcards.slice(5 - showHighcards, 5).map((h) => {
                return h.toString(false);
            });
            s = s + ` (${highcards.join(',')} high)`;
        }
        return s;
    }
}
exports.HandRank = HandRank;
//# sourceMappingURL=HandRank.js.map