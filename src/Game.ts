import Dealer from './Dealer'
import { Action, Street, ActionType, Stack } from './Define'
import Player from './Player'
import { IRule } from './Rule'
import { CardGroup } from '.'

enum gameStatus{
  NOTSTART,
  START,
  END
}

export default class Game {
  private _dealer: Dealer
  private _actions: Action[]
  private _players: Player[]
  private _startTime: Date
  private _rule: IRule
  private _street: Street
  private _boardCards: CardGroup
  private _playerFinalMoneys: {[playerId: string]: number}
  private _buttonPlayerId: string
  private _stack: Stack
  private _gameStatus: gameStatus

  /**
   *
   * @throws CanNotFindButtonPlayerError
   * @throws PlayersIsNotEnoughForGameError
   */
  constructor (rule: IRule,players: Player[],stack: Stack,buttonPlayerId: string) {
    this._dealer = new Dealer(rule)
    this._rule = rule
    this._players = players
    this._startTime = new Date()
    this._actions = []
    this._buttonPlayerId = buttonPlayerId
    this._stack = stack
  }

  /**
   * get next player that need to action
   *
   * @returns {Player}
   * @memberof Game
   */
  getNextPlayer (): Player {
    return null
  }

  /**
   * Player Raise
   *
   * @param {string} playerId
   * @param {number} [actionAmount]
   * @returns {Action}
   * @throws PlayerNotHaveEnoughMoneyError
   * @throws NotPlayerTurnToActionError
   * @throws GameIsNotStartError
   * @throws GameIsEndError
   * @throws CanNotActionAtStreet
   * @memberof Game
   */
  Raise (playerId: string,amount: number): Action {
    return null
  }

  /**
   * Player Check
   *
   * @param {string} playerId
   * @returns {Action}
   * @throws PlayerNotHaveEnoughMoneyError
   * @throws NotPlayerTurnToActionError
   * @throws GameIsNotStartError
   * @throws GameIsEndError
   * @throws CanNotActionAtStreet
   * @memberof Game
   */
  Check (playerId: string): Action {
    return null
  }

  /**
   * Player Fold
   *
   * @param {string} playerId
   * @returns {Action}
   * @throws PlayerNotHaveEnoughMoneyError
   * @throws NotPlayerTurnToActionError
   * @throws GameIsNotStartError
   * @throws GameIsEndError
   * @throws CanNotActionAtStreet
   * @memberof Game
   */
  Fold (playerId: string): Action {
    return null
  }

  /**
   * Player Call
   *
   * @param {string} playerId
   * @returns {Action}
   * @throws PlayerNotHaveEnoughMoneyError
   * @throws NotPlayerTurnToActionError
   * @throws GameIsNotStartError
   * @throws GameIsEndError
   * @throws CanNotActionAtStreet
   * @memberof Game
   */
  Call (playerId: string): Action {
    return null
  }

  /**
   * Player AllIn
   *
   * @param {string} playerId
   * @returns {Action}
   * @throws PlayerNotHaveEnoughMoneyError
   * @throws NotPlayerTurnToActionError
   * @throws GameIsNotStartError
   * @throws GameIsEndError
   * @throws CanNotActionAtStreet
   * @memberof Game
   */
  AllIn (playerId: string): Action {
    return null
  }

  /**
   * get hole cards of all players
   * @throws GameIsNotStartError
   * @returns {{[playerId: string]: CardGroup;}}
   * @memberof Game
   */
  getHoleCards (): {[playerId: string]: CardGroup;} {
    return null
  }

  /**
   * start this game
   * step.1 post sb,bb
   * step.2 dealer shuffle
   * step.3 dealer deal cards
   * step.4 change gameStatus to start
   * step.5 change street to preflop
   * @returns {Action}
   * @throws GameIsEndError
   * @throws GameIsStartedError
   * @memberof Game
   */
  startGame () {

  }

  /**
   * end this game
   * step.1 calculate players final money
   * step.2 change gameStatus to end
   * @throws GameIsEndError
   * @throws GameIsNotStartError
   * @memberof Game
   */
  endGame () {

  }
}

class PlayerNotHaveEnoughMoneyError extends Error {}
class NotPlayerTurnToActionError extends Error {}
class GameIsStartedError extends Error {}
class GameIsNotStartError extends Error {}
class GameIsEndError extends Error {}
class CanNotActionAtStreetError extends Error {}
class CanNotFindButtonPlayerError extends Error {}
class PlayersIsNotEnoughForGameError extends Error {}
