"use strict";
/**
 * Card, Rank, and Suit classes
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Suit {
    static all() {
        return [
            Suit.CLUB, Suit.DIAMOND, Suit.HEART, Suit.SPADE
        ];
    }
    static fromString(s) {
        switch (s) {
            case 'c':
                return Suit.CLUB;
            case 'd':
                return Suit.DIAMOND;
            case 'h':
                return Suit.HEART;
            case 's':
                return Suit.SPADE;
            default:
                throw new Error(`Invalid card suit: ${s}`);
        }
    }
}
Suit.CLUB = 1;
Suit.DIAMOND = 2;
Suit.HEART = 3;
Suit.SPADE = 4;
exports.Suit = Suit;
class Rank {
    static fromString(s) {
        switch (s) {
            case 't':
                return Rank.TEN;
            case 'j':
                return Rank.JACK;
            case 'q':
                return Rank.QUEEN;
            case 'k':
                return Rank.KING;
            case 'a':
                return Rank.ACE;
            default:
                const n = Number(s);
                if (isNaN(n) || n < Rank.TWO || n > Rank.NINE) {
                    throw new Error(`Invalid card rank: ${s}`);
                }
                return n;
        }
    }
    all() {
        return [
            Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN,
            Rank.EIGHT, Rank.NINE, Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
        ];
    }
}
Rank.TWO = 2;
Rank.THREE = 3;
Rank.FOUR = 4;
Rank.FIVE = 5;
Rank.SIX = 6;
Rank.SEVEN = 7;
Rank.EIGHT = 8;
Rank.NINE = 9;
Rank.TEN = 10;
Rank.JACK = 11;
Rank.QUEEN = 12;
Rank.KING = 13;
Rank.ACE = 14;
Rank.names = [
    null,
    null,
    { singular: 'deuce', plural: 'deuces' },
    { singular: 'three', plural: 'threes' },
    { singular: 'four', plural: 'fours' },
    { singular: 'five', plural: 'fives' },
    { singular: 'six', plural: 'sixes' },
    { singular: 'seven', plural: 'sevens' },
    { singular: 'eight', plural: 'eights' },
    { singular: 'nine', plural: 'nines' },
    { singular: 'ten', plural: 'tens' },
    { singular: 'jack', plural: 'jacks' },
    { singular: 'queen', plural: 'queens' },
    { singular: 'king', plural: 'kings' },
    { singular: 'ace', plural: 'aces' }
];
exports.Rank = Rank;
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    static fromString(s) {
        const tmp = s.replace(/[^a-z0-9]/gi, '');
        if (tmp.length !== 2) {
            throw new Error(`Invalid card: ${tmp}`);
        }
        return new Card(Rank.fromString(tmp[0].toLowerCase()), Suit.fromString(tmp[1].toLowerCase()));
    }
    getRank() {
        return this.rank;
    }
    getSuit() {
        return this.suit;
    }
    equals(c) {
        return (this.getRank() === c.getRank() && this.getSuit() === c.getSuit());
    }
    toString(suit = true, full, plural) {
        if (full) {
            if (plural) {
                return Rank.names[this.rank].plural;
            }
            return Rank.names[this.rank].singular;
        }
        let s = `${this.rank}`;
        if (this.rank === 10) {
            s = 'T';
        }
        else if (this.rank === 11) {
            s = 'J';
        }
        else if (this.rank === 12) {
            s = 'Q';
        }
        else if (this.rank === 13) {
            s = 'K';
        }
        else if (this.rank === 14) {
            s = 'A';
        }
        if (suit) {
            if (this.suit === Suit.CLUB) {
                s = s + 'c';
            }
            else if (this.suit === Suit.DIAMOND) {
                s = s + 'd';
            }
            else if (this.suit === Suit.HEART) {
                s = s + 'h';
            }
            else if (this.suit === Suit.SPADE) {
                s = s + 's';
            }
        }
        return s;
    }
}
exports.Card = Card;
//# sourceMappingURL=Card.js.map