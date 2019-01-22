/**
 * Tests for Card class
 */
import { Card, Rank, Suit, FullDeckRule } from '../src/index'
import Dealer, { NotBeenDealtError } from '../src/Dealer'

test('getBoardCards()  NotBeenDealtError ', () => {
  const rule = new FullDeckRule()
  const dealer = new Dealer(rule)
  expect(() => { dealer.getBoardCards() }).toThrow(NotBeenDealtError)
})

test('getDealtCards()  NotBeenDealtError ', () => {
  const rule = new FullDeckRule()
  const dealer = new Dealer(rule)
  expect(() => { dealer.getDealtCards() }).toThrow(NotBeenDealtError)
})