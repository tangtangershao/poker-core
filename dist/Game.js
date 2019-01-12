"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Game Variant Specfic Classes
 */
const Card_1 = require("./Card");
class FullDeckRank extends Card_1.Rank {
    all() {
        return [
            Card_1.Rank.TWO, Card_1.Rank.THREE, Card_1.Rank.FOUR, Card_1.Rank.FIVE, Card_1.Rank.SIX, Card_1.Rank.SEVEN,
            Card_1.Rank.EIGHT, Card_1.Rank.NINE, Card_1.Rank.TEN, Card_1.Rank.JACK, Card_1.Rank.QUEEN, Card_1.Rank.KING, Card_1.Rank.ACE
        ];
    }
}
exports.FullDeckRank = FullDeckRank;
class FullDeckGame {
    constructor() {
        this.HIGH_CARD = 1;
        this.PAIR = 2;
        this.TWO_PAIRS = 3;
        this.TRIPS = 4;
        this.STRAIGHT = 5;
        this.FLUSH = 6;
        this.FULL_HOUSE = 7;
        this.QUADS = 8;
        this.STRAIGHT_FLUSH = 9;
        this.FLUSH_BEATS_FULLHOUSE = false;
        this.A6789_STRAIGHT = false;
        this.A2345_STRAIGHT = true;
        this.rank = new FullDeckRank();
    }
}
exports.FullDeckGame = FullDeckGame;
class ShortDeckRank extends Card_1.Rank {
    all() {
        return [
            Card_1.Rank.SIX, Card_1.Rank.SEVEN, Card_1.Rank.EIGHT, Card_1.Rank.NINE, Card_1.Rank.TEN,
            Card_1.Rank.JACK, Card_1.Rank.QUEEN, Card_1.Rank.KING, Card_1.Rank.ACE
        ];
    }
}
exports.ShortDeckRank = ShortDeckRank;
class ShortDeckGame {
    constructor() {
        this.HIGH_CARD = 1;
        this.PAIR = 2;
        this.TWO_PAIRS = 3;
        this.TRIPS = 4;
        this.STRAIGHT = 5;
        this.FLUSH = 7;
        this.FULL_HOUSE = 6;
        this.QUADS = 8;
        this.STRAIGHT_FLUSH = 9;
        this.FLUSH_BEATS_FULLHOUSE = true;
        this.A6789_STRAIGHT = true;
        this.A2345_STRAIGHT = false;
        this.rank = new ShortDeckRank();
    }
}
exports.ShortDeckGame = ShortDeckGame;
//# sourceMappingURL=Game.js.map