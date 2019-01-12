"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * OddsCalculator
 *
 */
const _ = require("lodash");
const Card_1 = require("./Card");
const CardGroup_1 = require("./CardGroup");
const Game_1 = require("./Game");
const HandRank_1 = require("./HandRank");
class HandEquity {
    constructor() {
        this.possibleHandsCount = 0;
        this.bestHandCount = 0;
        this.tieHandCount = 0;
    }
    addPossibility(isBestHand, isTie) {
        this.possibleHandsCount += 1;
        if (isBestHand) {
            this.bestHandCount += 1;
        }
        else if (isTie) {
            this.tieHandCount += 1;
        }
    }
    getEquity() {
        if (this.possibleHandsCount === 0) {
            return 0;
        }
        return Math.round(this.bestHandCount * 100.0 / this.possibleHandsCount);
    }
    getTiePercentage() {
        if (this.possibleHandsCount === 0) {
            return 0;
        }
        return Math.round(this.tieHandCount * 100.0 / this.possibleHandsCount);
    }
    toString() {
        let s = `${this.getEquity()}%`;
        const tie = this.getTiePercentage();
        if (tie > 0) {
            s += ` (Tie: ${tie}%)`;
        }
        return s;
    }
}
exports.HandEquity = HandEquity;
class OddsCalculator {
    constructor(equities, handranks, iterations, elapsedTime) {
        this.equities = equities;
        this.handranks = handranks;
        this.iterations = iterations;
        this.elapsedTime = elapsedTime;
    }
    static calculate(cardgroups, board, gameVariant, iterations) {
        if (board && [0, 3, 4, 5].indexOf(board.length) === -1) {
            throw new Error('The board must contain 0, 3, 4 or 5 cards');
        }
        const allGroups = board ? cardgroups.concat(board) : cardgroups;
        let allCards = [];
        allGroups.forEach((group) => {
            allCards = allCards.concat(group);
        });
        // Invalid card values
        if (gameVariant === 'short') {
            allCards.forEach((card) => {
                if (card.getRank() < 6) {
                    throw new Error('Only cards rank 6 through A are valid.');
                }
            });
        }
        const uniqCards = _.uniqBy(allCards, (card) => {
            return card.getRank() + '-' + card.getSuit();
        });
        if (uniqCards.length !== allCards.length) {
            throw new Error('Detected duplicate cards');
        }
        iterations = iterations || 0;
        let game;
        if (gameVariant === 'short') {
            game = new Game_1.ShortDeckGame();
        }
        else {
            game = new Game_1.FullDeckGame();
        }
        let handranks = [];
        // Find out which cards are left in the deck
        const remainingCards = new CardGroup_1.CardGroup();
        if (!board || board.length <= 4) {
            for (const suit of Card_1.Suit.all()) {
                for (const rank of game.rank.all()) {
                    const c = new Card_1.Card(rank, suit);
                    let isUsed = false;
                    if (board) {
                        for (const boardCard of board) {
                            if (c.equals(boardCard)) {
                                isUsed = true;
                                break;
                            }
                        }
                    }
                    if (!isUsed) {
                        for (const cardgroup of cardgroups) {
                            for (const card of cardgroup) {
                                if (c.equals(card)) {
                                    isUsed = true;
                                    break;
                                }
                            }
                            if (isUsed) {
                                break;
                            }
                        }
                    }
                    if (!isUsed) {
                        remainingCards.push(c);
                    }
                }
            }
        }
        const remainingCount = remainingCards.length;
        // Figure out hand ranking
        handranks = cardgroups.map((cardgroup) => {
            return HandRank_1.HandRank.evaluate(game, board ? cardgroup.concat(board) : cardgroup);
        });
        const equities = cardgroups.map((cardgroup) => {
            return new HandEquity();
        });
        const selectWinners = (simulatedBoard) => {
            let highestRanking = null;
            let highestRankingIndex = [];
            for (let i = 0; i < cardgroups.length; i += 1) {
                const handranking = HandRank_1.HandRank.evaluate(game, cardgroups[i].concat(simulatedBoard));
                const isBetter = highestRanking
                    ? handranking.compareTo(highestRanking)
                    : -1;
                if (isBetter >= 0) {
                    if (isBetter === 0) {
                        highestRankingIndex.push(i);
                    }
                    else {
                        highestRankingIndex = [i];
                    }
                    highestRanking = handranking;
                }
            }
            for (let i = 0; i < cardgroups.length; i += 1) {
                let isWinning = false;
                let isTie = false;
                if (highestRankingIndex.length > 1) {
                    isTie = (highestRankingIndex.indexOf(i) > -1);
                }
                else {
                    isWinning = (highestRankingIndex.indexOf(i) > -1);
                }
                equities[i].addPossibility(isWinning, isTie);
            }
        };
        const jobStartedAt = +new Date();
        if (!board || board.length === 0) {
            iterations = iterations || OddsCalculator.DEFAULT_ITERATIONS;
            for (let x = iterations; x > 0; x -= 1) {
                const index1 = _.random(0, remainingCount - 1);
                let index2;
                let index3;
                let index4;
                let index5;
                do {
                    index2 = _.random(0, remainingCount - 1);
                } while (index2 === index1);
                do {
                    index3 = _.random(0, remainingCount - 1);
                } while (index3 === index1 || index3 === index2);
                do {
                    index4 = _.random(0, remainingCount - 1);
                } while (index4 === index1 || index4 === index2 || index4 === index3);
                do {
                    index5 = _.random(0, remainingCount - 1);
                } while (index5 === index1 || index5 === index2 || index5 === index3 || index5 === index4);
                const simulatedBoard = CardGroup_1.CardGroup.fromCards([
                    remainingCards[index1],
                    remainingCards[index2],
                    remainingCards[index3],
                    remainingCards[index4],
                    remainingCards[index5]
                ]);
                selectWinners(simulatedBoard);
            }
        }
        else if (board.length >= 5) {
            iterations = 1;
            selectWinners(board);
        }
        else if (board.length === 4) {
            for (const c of remainingCards) {
                const simulatedBoard = board.concat(CardGroup_1.CardGroup.fromCards([c]));
                iterations += 1;
                selectWinners(simulatedBoard);
            }
        }
        else if (board.length === 3) {
            for (let a = 0; a < remainingCount; a += 1) {
                for (let b = a + 1; b < remainingCount; b += 1) {
                    const simulatedBoard = board.concat(CardGroup_1.CardGroup.fromCards([remainingCards[a], remainingCards[b]]));
                    iterations += 1;
                    selectWinners(simulatedBoard);
                }
            }
        }
        const jobEndedAt = +new Date();
        return new OddsCalculator(equities, handranks, iterations, jobEndedAt - jobStartedAt);
    }
    getIterationCount() {
        return this.iterations;
    }
    getElapsedTime() {
        return this.elapsedTime;
    }
    getHandRank(index) {
        return this.handranks[index];
    }
}
OddsCalculator.DEFAULT_ITERATIONS = 100000;
exports.OddsCalculator = OddsCalculator;
//# sourceMappingURL=OddsCalculator.js.map