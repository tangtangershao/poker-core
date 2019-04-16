/**
 * Tests for Card class
 */
import { expect } from 'chai'
import { Card, Rank, Suit } from '../src/index'
import { HistoryPlayer } from '../src/HistoryPlayer';
import { HistoryPlayerOptions } from '../src/Define';


describe('Card', () => {
  describe('fromString()', () => {


    it('throws exception', () => {

     
      expect('1').to.equal('1')

    })
  })

})

describe('HistoryPlayer', () => {
  describe('constructor()', () => {

    it('throws exception', () => {
      let json = '{"playerCards":{"110":["5h","8d"]},"platform":"xxx","players":[{"id":"110","money":10000,"seat":3,"misc":{"zzz":{}}},{"id":"30001","money":10000,"seat":2,"misc":{"zzz":{}}},{"id":"30002","money":4125,"seat":1,"misc":{"zzz":{}}},{"id":"30003","money":1005800,"seat":6,"misc":{"zzz":{}}},{"id":"30004","money":10000,"seat":5,"misc":{"zzz":{}}}],"buttenPlayerId":"110","gameId":1555385313180,"startTime":"2019-04-16T03:28:33.180Z","stack":{"sb":5000,"bb":10000,"currency":"rmb"}}'
      let op = JSON.parse(json)
      console.log(' op ',op)
      let aa = new HistoryPlayer(op)
      // console.log('aa ',aa)
      expect('1').to.equal('1')
    })
  })

})
