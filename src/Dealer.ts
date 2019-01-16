import { IRule } from './Rule'
import { CardGroup } from './CardGroup'
import { Card } from '.'
import { Rank, Suit } from './Card'
import { random, Dictionary } from 'lodash'

export default class Dealer {

  private rule: IRule

  private allCards: CardGroup
  private boardCards: CardGroup
  private playerCards: Dictionary <CardGroup>
  private isDealAll = false

  /**
   *
   */
  constructor (rule: IRule) {
    this.rule = rule
  }

  /**
   * shuffle the cards
   * will clean the dealt history
   */
  shuffle () {
    this.boardCards = null
    this.playerCards = null
    this.isDealAll = false
    this.resetCards()
  }

  /**
   * get all five board cards
   */
  getBoardCards (): CardGroup {
    return this.boardCards
  }

  /**
   * get hole cards that dealt to all players
   * can only be executed after deal()
   * @returns {{[playerId: string]: CardGroup;}}
   * @throws NotBeenDealtError
   * @memberof Dealer
   */
  getDealtCards (): {[playerId: string]: CardGroup;} {
    if (!this.isDealAll)
    {
      throw new NotBeenDealtError()
    }
    return this.playerCards
   // return { '123456': CardGroup.fromCards([new Card(1,1),new Card(1,2)]) }
  }

  /**
   * deal hole cards to all players
   * can only be executed once after shuffle()
   * @param {string[]} playerIds
   * @throws HadBeenDealtError
   */
  dealAll (playerIds: string[]) {
    if (this.isDealAll)
    {
      throw new HadBeenDealtError()
    }

    let cardCount = 0
    for (let playerId of playerIds)
    {
      let cardGroup: CardGroup
      cardGroup.push(this.allCards[cardCount])
      cardCount += 1
      cardGroup.push(this.allCards[cardCount])
      cardCount += 1
      this.playerCards[playerId] = cardGroup
    }
    for (let i = 0;i < 5;i++ )
    {
      this.boardCards.push(this.allCards[cardCount])
      cardCount += 1
    }
    this.isDealAll = true
  }

  private resetCards ()
  {
    this.allCards = null
    if (this.rule.A6789_STRAIGHT)
    {
      for (let i = 1;i < 5;i++)
      {
        let suit = i
        this.allCards.push(new Card(Rank.ACE,suit))
        this.allCards.push(new Card(Rank.TWO,suit))
        this.allCards.push(new Card(Rank.THREE,suit))
        this.allCards.push(new Card(Rank.FOUR,suit))
        this.allCards.push(new Card(Rank.FIVE,suit))
        this.allCards.push(new Card(Rank.SIX,suit))
        this.allCards.push(new Card(Rank.SEVEN,suit))
        this.allCards.push(new Card(Rank.EIGHT,suit))
        this.allCards.push(new Card(Rank.NINE,suit))
        this.allCards.push(new Card(Rank.TEN,suit))
        this.allCards.push(new Card(Rank.JACK,suit))
        this.allCards.push(new Card(Rank.QUEEN,suit))
        this.allCards.push(new Card(Rank.KING,suit))
      }
    }

    if (this.rule.A2345_STRAIGHT)
    {
      for (let i = 1;i < 5;i++)
      {
        let suit = i
        this.allCards.push(new Card(Rank.ACE,suit))
        this.allCards.push(new Card(Rank.SIX,suit))
        this.allCards.push(new Card(Rank.SEVEN,suit))
        this.allCards.push(new Card(Rank.EIGHT,suit))
        this.allCards.push(new Card(Rank.NINE,suit))
        this.allCards.push(new Card(Rank.TEN,suit))
        this.allCards.push(new Card(Rank.JACK,suit))
        this.allCards.push(new Card(Rank.QUEEN,suit))
        this.allCards.push(new Card(Rank.KING,suit))
      }
    }

    for (let i = this.allCards .length - 1; i > 0; i--)
    {
      let rand = random(0,i,false)

      let temp: any = this.allCards [i]
      this.allCards [i] = this.allCards [rand]
      this.allCards [rand] = temp
    }
  }
}

class NotBeenDealtError extends Error {}

class HadBeenDealtError extends Error {}
