import Dealer from './Dealer'
import { Action, Street, ActionType, Stack } from './Define';
import Player from './Player';
import { IRule } from './Rule'
import { CardGroup, HandRank } from '.'
import { Dictionary } from 'lodash'
import  * as _ from 'lodash'
import { OddsCalculator } from './OddsCalculator'
import { Card } from "./Card";

enum gameStatus {
  NOTSTART,
  START,
  END
}

export default class Game {
  readonly gameId: number
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

  private _streetHighAmount: number // 此轮最高投入
  private _streeLastPlayerId: string // 此轮最后行动玩家

  private _playerDataDic: {[playerId: string]: PlayerData}

  private _pondsDic: PondsData[] =  []

  /**
   *
   * @throws CanNotFindButtonPlayerError
   * @throws PlayersIsNotEnoughForGameError
   */
  constructor (gameId:number,rule: IRule,players: Player[],stack: Stack,buttonPlayerId: string) {
    gameId = gameId
    this._dealer = new Dealer(rule)
    this._rule = rule
    this._players = players
    this._startTime = new Date()
    this._actions = []
    this._buttonPlayerId = buttonPlayerId
    this._stack = stack
    this._gameStatus = gameStatus.NOTSTART
    this._playerDataDic = {}
  }

  /**
   * get next player that need to action
   *
   * @returns {PlayerData}
   * @memberof Game
   * @throws GameIsNotStartError
   * @throws GameIsEndError
   */
  getNextPlayer (): PlayerData {
    this.checkGameStart()
    let nestPlayerId = this.getNestActionPlayerId()
    return this._playerDataDic[nestPlayerId]
  }

  /**
   * get next player cur street that need to action
   *
   * @returns {PlayerData}
   * @memberof Game
   * @throws GameIsNotStartError
   * @throws GameIsEndError
   */
  getNextPlayerCurStreet (): PlayerData {
    this.checkGameStart()
    if(this._streeLastPlayerId === '' && this._streetHighAmount === 0)
      return null
    let nestPlayerId = this.getNestActionPlayerId()
    return this._playerDataDic[nestPlayerId]
  }

  /**
   * Player bet
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
  Bet (playerId: string,amount: number): Action {
    this.canAction(playerId)
    this.conditionAction(playerId,ActionType.BET)
    let player = this.getPlayerData(playerId)
    if (player.player.money > amount)
    {
      let action = this.recordAction(playerId,ActionType.BET,amount)
      player.player.deductMoney(amount)
      this._streetHighAmount = amount
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
      this.isGameEnd()
      return action
    }else
    {
      throw new PlayerNotHaveEnoughMoneyError(` player  ${playerId}  money is not enough to bet  ${amount}`)
    }
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
    this.canAction(playerId)
    this.conditionAction(playerId,ActionType.RAISE)
    let player = this.getPlayerData(playerId)
    if (player.player.money > amount)
    {
      let action = this.recordAction(playerId,ActionType.RAISE,amount)
      player.player.deductMoney(amount)
      this._streetHighAmount = amount
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
      this.isGameEnd()
      return action
    }else
    {
      throw new PlayerNotHaveEnoughMoneyError(` player  ${playerId}  money is not enough to raise  ${amount}`)
    }
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
    this.canAction(playerId)
    this.conditionAction(playerId,ActionType.CHECK)
    let action = this.recordAction(playerId,ActionType.CHECK)
    if(this._streetHighAmount===0 && this._streeLastPlayerId==='')
    {
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
    }
    if(this.getNextPlayer())
    {
      let nextPlayer = this.getNextPlayer() 
      if(nextPlayer.player.id === this._streeLastPlayerId )
      {
        this.changeStreet()
      }
    }
   
    this.isGameEnd()
    return action
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
    this.canAction(playerId)
    this.conditionAction(playerId,ActionType.FOLD)
    let player = this.getPlayerData(playerId)
    let action = this.recordAction(playerId,ActionType.FOLD)
    if(this.getNextPlayer())
    {
      let nextPlayer = this.getNextPlayer() 
      if(nextPlayer.player.id === this._streeLastPlayerId )
      {
        this.changeStreet()
      }
    }
    this.isGameEnd()
    return action
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
    this.canAction(playerId)
    this.conditionAction(playerId,ActionType.CALL)
    let player = this.getPlayerData(playerId)
    let amount = this._streetHighAmount - player.streetBetAmount
    if (player.player.money > amount)
    {
      let action = this.recordAction(playerId,ActionType.CALL,amount)
      player.player.deductMoney(amount)
      if(this.getNextPlayer())
      {
        let nextPlayer = this.getNextPlayer() 
        if(nextPlayer.player.id === this._streeLastPlayerId )
        {
          this.changeStreet()
        }
      }
      this.isGameEnd()
      return action
    }else
    {
      throw new PlayerNotHaveEnoughMoneyError(` player  ${playerId}  money is not enough to Call  ${amount}`)
    }
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
    this.canAction(playerId)
    this.conditionAction(playerId,ActionType.ALLIN)
    let player = this.getPlayerData(playerId)
    let amount = player.player.money
    let action = this.recordAction(playerId,ActionType.CALL,amount)
    player.player.deductMoney(amount)
    if (amount > this._streetHighAmount)
    {
      this._streetHighAmount = amount
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
    }
    this.isGameEnd()
    return action
  }

  /**
   * get hole cards of all players
   * @throws GameIsNotStartError
   * @returns {{[playerId: string]: CardGroup;}}
   * @memberof Game
   */
  getHoleCards (): {[playerId: string]: CardGroup;} {
    if (this._gameStatus === gameStatus.NOTSTART)
    {
      throw new GameIsNotStartError()
    }
    return this._dealer.getDealtCards()
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
  startGame ()
  {
    if (this._gameStatus === gameStatus.START)
    {
      throw new GameIsStartedError()
    }else if (this._gameStatus === gameStatus.END)
    {
      throw new GameIsEndError()
    }

    let playerIds = []
    for (let i = 0;i < this._players.length;i++)
    {
      playerIds.push(this._players[i].id)
      this._playerDataDic[this._players[i].id] = {
        player: this._players[i],
        cards:null,
        lastActType: 0,
        index: i,
        streetBetAmount: 0,
        betAmount: 0,
        handRank: null,
        pondGet: 0
      }
    }
    this._street = Street.PREFLOP
    this.handleSBBB()

    this._dealer.shuffle()
    this._dealer.dealAll(playerIds)
    this._boardCards = this._dealer.getBoardCards()
    this._gameStatus = gameStatus.START
    for(let playerId in this._dealer.getDealtCards()) 
    {
      this._playerDataDic[playerId].cards = this._dealer.getDealtCards()[playerId]
    }

    this._streetHighAmount = this._stack.bb
    let sbPlayer = this.getNestPlayerData(this._buttonPlayerId)
    let bbPlayer = this.getNestPlayerData(sbPlayer.player.id)
    this._streeLastPlayerId = bbPlayer.player.id
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
    if (this._gameStatus === gameStatus.NOTSTART)
    {
      throw new GameIsNotStartError()
    }else if (this._gameStatus === gameStatus.END)
    {
      throw new GameIsEndError()
    }
    //this.changeStreet()
    this.setPlayerHandRank()
    this.calculatorPond()
    this._gameStatus = gameStatus.END
  }

  /**
   * get the amount of every pod ,this first is pot ,the others are side_pod
   * @throws GameIsNotStartError
   */
  getPodsAmount (): number[]
  {
    if (this._gameStatus === gameStatus.NOTSTART)
    {
      throw new GameIsNotStartError()
    }
    ////-------------------------------------------todo
    let podsAmount = []
    let pondBases = []
    for (let str in this._pondsDic)
    {
        pondBases.push(this._pondsDic[str].max) 
    }
    pondBases = _.sortedUniq(pondBases)
    pondBases = _.sortBy(pondBases)
    for (let i = 0;i < pondBases.length;i++)
    {
      let pondPlayerCount = 0
      let pondAmount = 0
      for (let playerId in this._playerDataDic)
      {
        if(i===0)
        {
          pondAmount = pondAmount + this._playerDataDic[playerId].betAmount
        }
        else
        {
          if (this._playerDataDic[playerId].betAmount >= pondBases[i]) {
            pondPlayerCount = pondPlayerCount + 1 }
        }
        
      }
      
      if (i === 0) // 底池
      {
        
      }else
      {
        let base = pondBases[i] - pondBases[i - 1]
        pondAmount = pondPlayerCount * base
      }
      podsAmount.push(pondAmount)
    }
    return podsAmount
  }

  /**
   * 检查是否在游戏中
   */
  private checkGameStart ()
  {
    if(this._gameStatus === gameStatus.NOTSTART)
    {
      throw new GameIsNotStartError()
    }else if (this._gameStatus === gameStatus.END)
    {
      throw new GameIsEndError()
    }
  }

  /**
   * 处理大小盲
   */
  private handleSBBB ()
  {
    let sbPlayer = this.getNestPlayerData(this._buttonPlayerId)
    let bbPlayer = this.getNestPlayerData(sbPlayer.player.id)
    if (sbPlayer.player.money < this._stack.sb)
    {
      throw new PlayersIsNotEnoughForGameError()
    }else
    {
      sbPlayer.player.deductMoney(this._stack.sb)
      let action = this.recordAction(sbPlayer.player.id,ActionType.SB,this._stack.sb)
    }
    if (bbPlayer.player.money < this._stack.bb)
    {
      throw new PlayersIsNotEnoughForGameError()
    }else
    {
      bbPlayer.player.deductMoney(this._stack.bb)
      let action = this.recordAction(bbPlayer.player.id,ActionType.BB,this._stack.bb)
    }
  }

  /**
   * 根据玩家id获取玩家状态信息
   * @param playerId
   */
  private getPlayerData (playerId: string): PlayerData
  {
    return this._playerDataDic[playerId]
  }

  /**
   * 获取下个玩家状态信息
   * @param playerId 玩家id
   */
  private getNestPlayerData (playerId: string): PlayerData
  {
    let index = this._playerDataDic[playerId].index
    index = index + 1
    if (index === this._players.length) { index = 0 }
    let nextPlayerId = this._players[index].id
    return this._playerDataDic[nextPlayerId]
  }

  /**
   * 获取上个玩家状态信息
   * @param playerId 玩家id
   */
  private getLastPlayerData (playerId: string): PlayerData
  {
    let index = this._playerDataDic[playerId].index
    index = index - 1
    if (index === -1) { index = this._players.length - 1 }
    let lastPlayerId = this._players[index].id
    return this._playerDataDic[lastPlayerId]
  }

  /**
   * 获取下个可行动玩家
   * @param playerId  默认 最后一个行动玩家Id
   */
  private getNestActionPlayerId (playerId?: string): string
  {
    if (!playerId) { playerId = this._actions[this._actions.length - 1].playerId }
    let nestPlayer = this.getNestPlayerData(playerId)
    let nestPlayerId = nestPlayer.player.id

    if (nestPlayerId === this._actions[this._actions.length - 1].playerId)
    {
      console.log(" getNestActionPlayerId 游戏结束")
      this.endGame()
     
    }

    if (nestPlayer.lastActType === ActionType.FOLD || nestPlayer.lastActType === ActionType.ALLIN)
    {
      return this.getNestActionPlayerId(nestPlayerId)
    }else
    {
      return nestPlayerId
    }
  }

  /**
   * 检查一轮结束是否只剩一个可行动者
   */
  private isGameEnd ()
  {
    let lastAction = this.getLastActionNotFold(true)
    if (lastAction )
    {
      let foldCount = 0
      for (let playerId in this._playerDataDic)
      {
        if (this._playerDataDic[playerId].lastActType === ActionType.FOLD )
        {
          foldCount = foldCount + 1
        }
      }
      if(foldCount === _.size(this._playerDataDic) - 1)
      {
        this.endGame()
      }
      return
    } else
    {
      let canActionCount = 0
      for (let playerId in this._playerDataDic)
      {
        if (this._playerDataDic[playerId].lastActType !== ActionType.FOLD &&
          this._playerDataDic[playerId].lastActType !== ActionType.ALLIN )
        {
          canActionCount = canActionCount + 1
        }
      }
      if(canActionCount === 1)
      {
        this.endGame()
      }
    }
  }

  /**
   * 记录行动
   * @param playerData 玩家状态信息
   * @param actionType 行动类型
   * @param amount 行动金额
   */
  private recordAction (playerId: string,actionType: ActionType,amount?: number)
  {
    let playerData = this._playerDataDic[playerId]
    let action = new Action()
    action.playerId = playerData.player.id
    action.type = actionType
    action.street = this._street
    action.amount = 0
    if (amount)
    {
      action.amount = amount
    }
    this._actions.push(action)
    playerData.lastActType = actionType
    let streetBetAmount = playerData.streetBetAmount + action.amount
    playerData.streetBetAmount = streetBetAmount
    let betAmount = playerData.betAmount + action.amount
    playerData.betAmount = betAmount
    this.setPonds(action)
    return action
  }

  private setPonds(act:Action)
  {
    let pondCount = this._pondsDic.length
    if(pondCount === 0)
    {
     
      this._pondsDic.push({base:0,max:0 })
    }
    let pond0 =  this._pondsDic[0]
    if(act.type!==ActionType.ALLIN)
    {
      if(pondCount<2) 
      {
        if( pond0.base === 0){}
        pond0.max =  pond0.max < act.amount ? act.amount:pond0.max
      }
      else
      {
        //逐个计算若没有匹配的 新池产生
        _.orderBy(this._pondsDic,['max'])
        let bigId = -1
        for(let i=0;i<this._pondsDic.length;i++)
        {
          if(this._pondsDic[i].max > act.amount)
          {
            bigId = i
            break
          }
        }
        if(bigId === 0)
        {
          this._pondsDic.push({base:act.amount,max:act.amount })
          pond0.base = pond0.base - act.amount
          return
        }
        else if(bigId === -1)
        {
          let pondLast= this._pondsDic[this._pondsDic.length]
          this._pondsDic.push({base:act.amount - pondLast.max ,max:act.amount })
          return
        }
        else
        {
          let pondBig= this._pondsDic[bigId]
          pondBig.base = pondBig.max - act.amount
          let pondSmal= this._pondsDic[bigId- 1]
          this._pondsDic.push({base:act.amount - pondSmal.max ,max:act.amount })
          return
        }
      }
    }
    else
    {
      if(pondCount<2) 
      {
        if( pond0.max > act.amount)
        {
          // 产生边池
          pond0.base = act.amount
          pond0.max = act.amount
          this._pondsDic.push(
          {base:pond0.max - act.amount,max:pond0.max})
        }
        else
        {
          if( pond0.base === 0){ pond0.base = act.amount }
          pond0.max =  pond0.max < act.amount ? act.amount:pond0.max
        }
      }
      else
      {
        //逐个计算若没有匹配的 新池产生
        _.orderBy(this._pondsDic,['max'])
        let bigId = -1
        for(let i=0;i<this._pondsDic.length;i++)
        {
          if(this._pondsDic[i].max > act.amount)
          {
            bigId = i
            break
          }
        }
        if(bigId === 0)
        {
          this._pondsDic.push({base:act.amount,max:act.amount })
          pond0.base = pond0.base - act.amount
          return
        }
        else if(bigId === -1)
        {
          let pondLast= this._pondsDic[this._pondsDic.length]
          this._pondsDic.push({base:act.amount - pondLast.max ,max:act.amount })
          return
        }
        else
        {
          let pondBig= this._pondsDic[bigId]
          pondBig.base = pondBig.max - act.amount
          let pondSmal= this._pondsDic[bigId-1]
          this._pondsDic.push({base:act.amount - pondSmal.max ,max:act.amount })
          return
        }
      }
    }

  }

  /**
   * 获取上次有效行动（盖牌和每轮开始 返回空行动 因为无法用来判定下次行动）
   */
  private getLastActionNotFold (mustSameStreet: boolean): Action
  {
    for (let i = this._actions.length - 1; i > 0; i--)
    {
      let action = this._actions[i]
      if (mustSameStreet)
      {
        if (action.street === this._street) // 同一轮
        {
          if (action.type !== ActionType.FOLD) { return action }
        }
      }else
      {
        if (action.type !== ActionType.FOLD && action.type !== ActionType.ALLIN) { return action }
      }
    }
    return null
  }

   /**
   * 获取此轮最高下注
   */
  getLastActionBet ():number
  {
    return this._streetHighAmount
  }

  /**
   * 根据上次行动类型 判定下次可行动类型列表
   * @param actionType 上次行动类型
   */
  private nestActionCanDo (actionType: ActionType): number[]
  {
    let canActs = []
    switch (actionType)
    {
      case ActionType.BET:
      case ActionType.CALL:
      case ActionType.RAISE:
      case ActionType.BB:
        canActs.push(ActionType.CALL)
        canActs.push(ActionType.FOLD)
        canActs.push(ActionType.RAISE)
        canActs.push(ActionType.ALLIN)
        break
      case ActionType.CHECK:
        canActs.push(ActionType.CHECK)
        canActs.push(ActionType.FOLD)
        canActs.push(ActionType.BET)
        canActs.push(ActionType.RAISE)
        canActs.push(ActionType.ALLIN)
        break
      case ActionType.ALLIN:
        canActs.push(ActionType.CALL)
        canActs.push(ActionType.FOLD)
        canActs.push(ActionType.RAISE)
        canActs.push(ActionType.ALLIN)
        break
      case ActionType.SB:
        break
      case ActionType.FOLD:
        break
      default : // i am the first
        canActs.push(ActionType.CHECK)
        canActs.push(ActionType.FOLD)
        canActs.push(ActionType.BET)
        canActs.push(ActionType.RAISE)
        canActs.push(ActionType.ALLIN)
        break
    }
    return canActs
  }

  /**
   * 判定玩家可否参与行动
   * @param playerId 玩家id
   */
  private canAction (playerId: string)
  {
    this.checkGameStart()
    let playerData = this._playerDataDic[playerId]
    if (playerData.lastActType === ActionType.FOLD || playerData.lastActType === ActionType.ALLIN)
    {
      throw new NotPlayerTurnToActionError(` player ${playerData.player.id} is fold or allin  ,can not action any more `)
    }
    if (this.getNestActionPlayerId() !== playerId)
    {
      throw new NotPlayerTurnToActionError(`nest action player is not ${playerId}`)
    }
  }

  /**
   * 判定玩家行动条件是否满足
   * @param playerId 玩家id
   * @param actionType 行动类型
   */
  private conditionAction (playerId: string,actionType: ActionType)
  {
    // 大小盲proflop这一轮特殊处理
    if (this._playerDataDic[playerId].lastActType === ActionType.BB && this._playerDataDic[playerId].streetBetAmount === this._streetHighAmount )
    {
      if (actionType === ActionType.CALL){
        throw new CanNotActionAtStreetError(`nest action  not allowd player ${playerId} action -${actionType}`)
      }else if (actionType === ActionType.CHECK){
        return
      }
    }

    let lastAction = this.getLastActionNotFold(true)
    let lastActionType = 0
    if (lastAction )
    {
      lastActionType = lastAction.type
    }
    let canActs = this.nestActionCanDo(lastActionType)
    let haveAct = false
    for (let act of canActs)
    {
      if (actionType === act)
      {
        haveAct = true
        break
      }
    }
    if (!haveAct)
    {
      throw new CanNotActionAtStreetError(`nest action  not allowd player ${playerId} action -${actionType}`)
    }
  }

  /**
   * 转到下一轮
   */
  private changeStreet ()
  {
    let curStreet = this._street
    switch (curStreet)
    {
      case Street.PREFLOP: this._street = Street.FLOP
        break
      case Street.FLOP: this._street = Street.TURN
        break
      case Street.TURN: this._street = Street.RIVER
        break
      case Street.RIVER:  this.endGame()
       break
      default:
        break
    }
    for (let playerId in this._playerDataDic)
    {
      this._playerDataDic[playerId].streetBetAmount = 0
    }
    this._streeLastPlayerId = ""
    this._streetHighAmount = 0
  }

 /**
   * 设置翻牌圈的牌
   * @param cards
   */
  setFlopCards(cards:Card[]){
    this._dealer.setFlopCards(cards)
  }

  /**
   * 设置转牌圈的牌
   * @param card
   */
  setTurnCards(card:Card){
    this._dealer.setTurnCard(card)
  }
  
  /**
   * 设置河牌圈的牌
   * @param card
   */
  setRiverCards(card:Card){
    this._dealer.setRiverCard(card)
  }

  /**
   * 设置玩家手牌排名数据
   */
  private setPlayerHandRank ()
  {
    let playerCards = this._dealer.getDealtCards()
    let newPlayerCard = []
    let newPlayerId = []
    for (let playerId in this._playerDataDic)
    {
      newPlayerCard.push(playerCards[playerId])
      newPlayerId.push(playerId)
    }
    let oddsCalculator = OddsCalculator.calculate(newPlayerCard,this._dealer.getBoardCards())

    for (let i = 0;i < newPlayerCard.length;i++)
    {
      let handRank = oddsCalculator.getHandRank(i)
      this._playerDataDic[newPlayerId[i]].handRank = handRank
    }
  }

  /**
   * 获取玩家排名
   * @param playerId 玩家Id
   */
  private getPlayerRank (playerId: string): number
  {
    if (this._playerDataDic[playerId].handRank)
    {
      return this._playerDataDic[playerId].handRank.getRank()
    }
    return 0
  }

  /**
   * 获取列表中排名最高玩家列表
   * @param players
   */
  private getHighRankPlayer (players: any): string[]
  {
    let highers: string[] = []
    let sortPondPlayer = _.sortBy(players, [function (o: any) { return -o.rank }])
    let firstRank = sortPondPlayer[0].rank

    for (let i = 0;i < sortPondPlayer.length;i++)
    {
      if (sortPondPlayer[i].rank === firstRank)
      {
        highers.push(sortPondPlayer[i].playerId)
      }
    }

    if (highers.length === 1)
    {
      return highers
    }else if (highers.length > 1)
    {
      let result = []
      let first = highers[0]
      let firstHandRank = this._playerDataDic[highers[0]].handRank
      for (let i = 1;i < highers.length;i++)
      {
        let handRank = this._playerDataDic[highers[i]].handRank
        if (firstHandRank.compareTo(handRank) === 1)
        {
          first = highers[i]
          firstHandRank = handRank
        }
      }

      for (let i = 0;i < highers.length;i++)
      {
        let handRank = this._playerDataDic[highers[i]].handRank
        if (firstHandRank.compareTo(handRank) === 0)
        {
          result.push(first)
        }
      }
      return result
    }
    return null
  }

  /**
   * 结算所有池子
   */
  private calculatorPond ()
  {
    let pondBases = []
    ////-------------------------------------------todo
    for (let str in this._pondsDic)
    {
        pondBases.push(this._pondsDic[str].max) 
    }
    pondBases = _.sortedUniq(pondBases)
    pondBases = _.sortBy(pondBases)
    for (let i = 0;i < pondBases.length;i++)
    {
      let pondPlayers = []
      let pondleftPlayers = []
      let pondAmount = 0
      for (let playerId in this._playerDataDic)
      {
        if(i === 0)
        {
          pondAmount = pondAmount + this._playerDataDic[playerId].betAmount
          pondPlayers.push({ rank: this.getPlayerRank(playerId),playerId: playerId }) 
          if(this._playerDataDic[playerId].lastActType !== ActionType.FOLD)
          {
            pondleftPlayers.push({ rank: this.getPlayerRank(playerId),playerId: playerId }) 
          }
        }
        else
        {
          if (this._playerDataDic[playerId].betAmount >= pondBases[i]) {
            pondPlayers.push({ rank: this.getPlayerRank(playerId),playerId: playerId }) 
            if(this._playerDataDic[playerId].lastActType !== ActionType.FOLD)
            {
              pondleftPlayers.push({ rank: this.getPlayerRank(playerId),playerId: playerId }) 
            }
          }
        }
      }

      if (i === 0) // 底池
      {
      }else
      {
        let base = pondBases[i] - pondBases[i - 1]
        pondAmount = _.size(pondPlayers) * base
      }
      let winners = this.getHighRankPlayer(pondleftPlayers)
      //console.log(" 池子所有玩家 ",pondPlayers," 池子 获胜者 ",winners)
      for (let i = 0;i < winners.length;i++)
      {
        let amount = this._playerDataDic[winners[i]].pondGet + pondAmount / winners.length
        this._playerDataDic[winners[i]].pondGet = amount
      }
    }
    this.setPlayerFinalMoney()
  }

  /**
   * 计算玩家最终金币数
   */
  private setPlayerFinalMoney ()
  {
    this._playerFinalMoneys = {}
    for (let playerId in this._playerDataDic)
    {
      let player = this._playerDataDic[playerId]
      player.player.addMoney(player.pondGet)
      this._playerFinalMoneys[playerId] = player.player.money
    }
  }

  //* 暂存 测试用到
  getAllActions (): Action[]
  {
    return this._actions
  }

  getPlayerDataDic (): any
  {
    return this._playerDataDic
  }

  getPlayerMoneys (): any
  {
    return this._playerFinalMoneys
  }

  getBoardCardGroup (): CardGroup
  {
    return this._boardCards
  }  
  getStreet (): Street
  {
    return this._street
  }
  
  getStack (): Stack
  {
    return this._stack
  }

  isEnd (): boolean
  {
    return this._gameStatus === gameStatus.END
  }

  btnPlayerId (): string
  {
    return this._buttonPlayerId
  }
}

export class PlayerData
{
  player: Player
  cards:CardGroup
  lastActType: ActionType     // 最后一次行动类型
  index: number               // 在数组_player中的索引
  streetBetAmount: number     // 此轮投入
  betAmount: number           // 所有投入
  handRank: HandRank          // 排名
  pondGet: number             // 从所有奖池获得
}
class PondsData
{
  max:number                  //池子最大注
  base:number             
}


export class PlayerNotHaveEnoughMoneyError extends Error {}
export class NotPlayerTurnToActionError extends Error {}
export class GameIsStartedError extends Error {}
export class GameIsNotStartError extends Error {}
export class GameIsEndError extends Error {}
export class CanNotActionAtStreetError extends Error {}
export class CanNotFindButtonPlayerError extends Error {}
export class PlayersIsNotEnoughForGameError extends Error {}
