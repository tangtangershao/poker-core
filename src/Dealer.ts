import { IRule } from './Rule'
import { CardGroup } from './CardGroup'
import { Card } from '.'

export default class Dealer {

  private rule: IRule

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

  }

  /**
   * get all five board cards
   */
  getBoardCards (): CardGroup {
    return null
  }

  /**
   * get hole cards that dealt to all players
   * can only be executed after deal()
   * @returns {{[playerId: string]: CardGroup;}}
   * @throws NotBeenDealtError
   * @memberof Dealer
   */
  getDealtCards (): {[playerId: string]: CardGroup;} {
    return { '123456': CardGroup.fromCards([new Card(1,1),new Card(1,2)]) }
  }

  /**
   * deal hole cards to all players
   * can only be executed once after shuffle()
   * @param {string[]} playerIds
   * @throws HadBeenDealtError
   */
  dealAll (playerIds: string[]) {

  }
}

class NotBeenDealtError extends Error {}

class HadBeenDealtError extends Error {}
