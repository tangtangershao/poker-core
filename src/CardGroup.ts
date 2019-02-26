/**
 * CardGroup
 *
 * a group of card objects
 * (typically either a player's hand, or the shared board)
 */
import * as _ from 'lodash'
import { Card, Suit } from './Card'

export class CardGroup extends Array {
  public constructor () {
    super()
  }

  public static fromString (s: string): CardGroup {
    const tmp: string = s.replace(/[^a-z0-9]/gi, '')
    if (tmp.length % 2 !== 0) {
      throw new Error(`Invalid cards: ${s}`)
    }

    const cardgroup: CardGroup = new CardGroup()
    for (let i: number = 0; i < tmp.length; i = i + 2) {
      cardgroup.push(Card.fromString(tmp.substring(i, i + 2)))
    }
    return cardgroup
  }

  public static fromCards (cards: Card[]): CardGroup {
    const cardgroup: CardGroup = new CardGroup()
    for (const card of cards) {
      cardgroup.push(card)
    }
    return cardgroup
  }

  public contains (c: Card): boolean {
    for (const card of this) {
      if (card.equals(c)) {
        return true
      }
    }
    return false
  }

  public toString (): string {
    return '' + this.join(' ')
  }

  public sortCards (cardType: 'asc'|'desc'): void {
    const sorted: Card[] = _.orderBy(this, ['rank', 'suit'], [cardType, cardType])
    /* tslint:disable:no-any */
    this.splice.apply(this, ([ 0, this.length ] as any[]).concat(
      sorted
    ))
  }

  public concat (cardgroup: CardGroup): CardGroup {
    const ret: CardGroup = new CardGroup()
    for (const card of this) {
      ret.push(card)
    }
    for (const card of cardgroup) {
      ret.push(card)
    }
    return ret
  }

  public countBy (cardType: string): {[x: string]: number} {
    return _.countBy(this, cardType)
  }

  //仅限模拟服务器使用
  public toNumArray():number[]
  {
    const result = []
    
    for (const card of this) {

      let cardId = 0
      let num = card.getRank() - 2 
      if(num === 0)  num= 13
      let type = 0
      switch(card.getSuit ())
      {
        case Suit.CLUB :// 4,//方块
        type = 4
        break 
        case Suit.DIAMOND ://= 3, //菱形
        type = 3
        break 
        case Suit.HEART :// 2, //红心
        type = 2
        break 
        case Suit.SPADE ://1, //黑桃
        type = 1
        break 
      }
      cardId = num + (type-1)*13
      result.push(cardId)
    }
    return result
   
  }
}
