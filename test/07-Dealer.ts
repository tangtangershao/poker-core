/**
 * Tests for Card class
 */
import { expect } from 'chai'
import { Card, Rank, Suit } from '../src/index'

describe('addCard()', () => {
    it('formats correctly', () => {
      const strings: string[] = [
        'Ac', '4d', 'Th', 'Jh', 'Qs', 'Kd', '2s'
      ]
      for (const s of strings) {
        expect(Card.fromString(s).toString()).to.equal(s)
      }
    })
  })