import Game from './Game';
import History, { Street, PlayerStatus, Action, StreetStatus, HistoryPlayerOptions, RelactivePosition, ActionType, Position ,Stack } from "./Define";
import { IRule, FullDeckRule } from './Rule';
import Player from "./Player";
import { Card } from "./Card";
import Dealer from './Dealer'
import  * as _ from 'lodash'
import { OddsCalculator } from './OddsCalculator'
import { HandRank } from './HandRank'
import { CardGroup } from "./CardGroup";
export default class HistoryPlayer {

  private _history: History

  constructor (options: HistoryPlayerOptions|History) {
    if( !options.hasOwnProperty('actions'))
    {
      if (this._history == null) {
        this._history = new History()
        this._history.gameId = options.gameId
        this._history.platform = options.platform
        this._history.buttenPlayerId = options.buttenPlayerId
        this._history.players = options.players
        this._history.rule = options.rule ? options.rule :new FullDeckRule()
        this._history.stack = options.stack
        this._history.playerCards = options.playerCards
        this._history.startTime = options.startTime
        this.setGame()
        this._history.BoardCards = this._boardCards
        this._history.actions = this._actions
        this._history.street = this._street
      }
    }
    else
    {
      if (this._history == null) {
        this._history = <History>options
        this._history.rule = options.rule ? options.rule :new FullDeckRule()
        this.setGame(true)
      }
    }
  }

  /**
   * 获取历史纪录
  */
  getHistory():History{
    return this._history
  }

  /**
   * 增加加注记录
   * @param playerId 
   * @param amount 
   */
  addRaise (playerId: string,amount: number){
    this.Raise(playerId,amount)
  }


  /**
   * 增加过牌记录
   * @param playerId 
   */
  addCheck (playerId: string){
    this.Check(playerId)
  }

  /**
   * 增加弃牌记录
   * @param playerId 
   */
  addFold (playerId: string){
    this.Fold(playerId)
  }

  /**
   * 增加跟注记录
   * @param playerId 
   */
  addCall (playerId: string){
    this.Call(playerId)
  }

  /**
   * 增加全下记录
   * @param playerId 
   */
  addAllIn (playerId: string){
    this.AllIn(playerId)
  }

  /**
   * 设置翻牌圈的牌
   * @param cards
   */
  setFlopCards(cards:string[]){
    this._boardCards = cards
  }

  /**
   * 设置转牌圈的牌
   * @param card
   */
  setTurnCards(card:string){
    this._boardCards.push(card)
  }

  /**
   * 设置河牌圈的牌
   * @param card
   */
  setRiverCards(card:string){
    this._boardCards.push(card)
  }

  /**
   * 获取公共牌
   */
  getBoardCards(): string[]{
    let boardCards = this.getBoardCardGroup()
    return boardCards
  }

  /**
   * 获取当前需要行动玩家的状态
   * 如果当前街不允许行动，则返回空
   */
  getCurrentPlayerStatus():PlayerStatus{
    let nextPlayer = this.getNextPlayerCurStreet()
    if(nextPlayer)
    {
      let playeStatus = new PlayerStatus()
      playeStatus.playerId = parseInt(nextPlayer.player.id)
      playeStatus.money = nextPlayer.player.money
      playeStatus.isMyTurn = true
      playeStatus.position = this.getPlayerPostion(nextPlayer.player.id)
      playeStatus.relactivePosition = this.getPlayerrelactivePosition(nextPlayer.player.id)
      playeStatus.miniRaiseAmount = this.getminiRaiseAmount(nextPlayer.player.id)
      return playeStatus
    }
    return null
  }

  /**
   * 获取玩家状态
   * @param playerId 
   */
  getPlayerStatus(playerId:string):PlayerStatus{
    let player = this._playerDataDic[playerId]
    if(player)
    {
      let nextPlayer = this.getNextPlayerCurStreet()
      let playeStatus = new PlayerStatus()
      playeStatus.playerId = parseInt(player.player.id)
      playeStatus.money = player.player.money
      playeStatus.isMyTurn = nextPlayer.player.id === playerId ? true :false
      playeStatus.position = this.getPlayerPostion(player.player.id)
      playeStatus.relactivePosition = this.getPlayerrelactivePosition(player.player.id)
      playeStatus.miniRaiseAmount =playeStatus.isMyTurn?this.getminiRaiseAmount(player.player.id):0
      return playeStatus
    }
    return null
  }

  /**
   * 获取当前街状态
   */
  getCurrentStreet():StreetStatus{
    let street = new StreetStatus()
    street.street = this._street
    street.playerCount = 0
    street.players = []
    for (const key in this._playerDataDic) {
      const element = this._playerDataDic[key]
      if(element.lastActType !== ActionType.FOLD)
      {
        street.playerCount = street.playerCount + 1
        street.players.push(parseInt(element.player.id))
      }
    }
    
    street.pot = this.getPodsAmount()
    street.potTotal = 0
    street.pot.forEach(element => {
    street.potTotal = street.potTotal + element
    });
    street.lastBet  = this._streetHighAmount
    return street
  }

  /**
   * 获取根据底池比例加注大小
   * 算法：
   * * 最后加注大小（LP）最后加注大小（LP）
   * * 除最后加注以外的底池（M）
   * * 底池百分比（C）
   * * 公式： ((2*LP + M)*C) + LP
   * @param potPercent 底池百分比，默认为1
   */
  getPotSizeIfReraise(potPercent:number=1):number{
    let streetStatus  = this.getCurrentStreet()
    return  (streetStatus.lastBet*2+streetStatus.potTotal -
      streetStatus.lastBet )*potPercent + streetStatus.lastBet
  }
  
  /**
   * 获取行动列表
   */
  getActions():Action[]{
    return this._actions
  }
  
  /**
   * 获取某街行动列表
   */
  getStreetActions(street:Street):Action[]{
    let streetActions = []
    for (let i = 0;i< this._actions.length ; i++)
    {
      let act = this._actions[i]
      if(act.street === street)
      {
        streetActions.push(act)
      }
    }
    return streetActions
  }

  /**
   * 获取结算结果 playerCards {[playerId: string]: CardGroup}
   */
  showDown(playerCards: {[playerId: string]: string[]},playerWins: {[playerId: string]: number}):any{
    for(let playerId in playerCards) 
    {
      this._history.playerCards[playerId] =  playerCards[playerId]
      this._playerDataDic[playerId].cards = playerCards[playerId]
    }
    this._history.playerWins = playerWins
    let playePondWin : {[playerId: string]: number}= {}
    for (const key in this._playerDataDic) {
      let bet = this._playerDataDic[key].betAmount
      let pondGet = playerWins[key] ? playerWins[key] :0
      playePondWin[key] = pondGet + bet
    }
    this._history.playerCollects = playePondWin
  }

  private getPlayerPostion(playerId:string):Position
  {
      let players = this._history.players
      let btnPlayer = this._history.buttenPlayerId
      let playerIndex  = 0
      let btnplayerIndex = 0
      for(let i = 0;i<players.length;i++)
      {
          if(players[i].id === btnPlayer)
          btnplayerIndex = i
          if(players[i].id === playerId)
          playerIndex = i
      }
      let cha = Math.abs(btnplayerIndex - playerIndex) 
      let pos = Position.button + cha
      if(pos > Position.button)
      pos = pos -5
      return pos
  }

  private getPlayerrelactivePosition(playerId:string):RelactivePosition
  {
    if(this._playerDataDic[playerId].lastActType === ActionType.FOLD || 
      this._playerDataDic[playerId].lastActType === ActionType.ALLIN)
      {
        return -1
      }
      let streetAction = []
      for (let i = this._actions.length - 1; i > 0; i--)
      {
        let action = this._actions[i]
        if (action.street === this._street) 
        {
          streetAction.push(action)
        }
      }
      let actionOne = null
      let letfPlayer :{[playerId: string]: number}={}
      for (let playerId in this._playerDataDic)
      {
        if(this._playerDataDic[playerId].lastActType !== ActionType.FOLD && 
        this._playerDataDic[playerId].lastActType !== ActionType.ALLIN) 
          letfPlayer[playerId] = ( this._playerDataDic[playerId].index)
      }
      if(streetAction.length === 0)
      {
        actionOne = this.getNextPlayer().player.id
      }
      else
      {
        actionOne = streetAction[streetAction.length -1].playerId
        for (let i = streetAction.length - 1; i > 0; i--)
        {
          if(streetAction[i].type ==  ActionType.FOLD || ActionType.ALLIN)
          {
            letfPlayer[ streetAction[i].playerId] = (this._playerDataDic[streetAction[i].playerId].index)
          }
        }
      }
    
      if(playerId === actionOne )
        return RelactivePosition.ep
      _.sortBy(letfPlayer,[function (o: any) { return o.index }])

      let index = 0
      let actiononeindex = 0
      let newLeftPlayer = []
      for (let playerId in letfPlayer)
      {
        if(playerId = actionOne)
        {
          actiononeindex = index
        }
        newLeftPlayer.push(playerId)
        index  = index + 1
      }
      let lastOne = null
      if(actiononeindex===0)
      {
        lastOne = newLeftPlayer[index]
      }
      else
      {
        lastOne = newLeftPlayer[actiononeindex-1]
      }
      if(lastOne===playerId)
      return RelactivePosition.mp
      
      return RelactivePosition.lp
  }
  
  private getminiRaiseAmount(playerId:string):number
  {
      let num = this._streetHighAmount
      if(num === 0)
      {
        num = this._stack.bb
      }
      return num*2
  }

  //#region 
  private _actions: Action[]
  private _players: Player[]
  private _rule: IRule
  private _street: Street
  private _playerFinalMoneys: {[playerId: string]: number}
  private _buttonPlayerId: string
  private _stack: Stack

  private _boardCards :string[] = []
  private _streetHighAmount: number // 此轮最高投入
  private _streeLastPlayerId: string // 此轮最后行动玩家

  private _playerDataDic: {[playerId: string]: PlayerData}

  private _pondsDic: PondsData[] =  []
  
  private getNextPlayer (): PlayerData {
    let nestPlayerId = this.getNestActionPlayerId()
    return this._playerDataDic[nestPlayerId]
  }
  
  private getNextPlayerCurStreet (): PlayerData {
    if(this._streeLastPlayerId === '' && this._streetHighAmount === 0)
    return null
    let nestPlayerId = this.getNestActionPlayerId()
    return this._playerDataDic[nestPlayerId]
  }

  private Bet (playerId: string,amount: number): Action {
    let player = this.getPlayerData(playerId)
      let action = this.recordAction(playerId,ActionType.BET,amount)
      player.player.deductMoney(amount)
      this._streetHighAmount = amount
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
      return action
  }
  
  private Raise (playerId: string,amount: number): Action {
    let player = this.getPlayerData(playerId)
      let action = this.recordAction(playerId,ActionType.RAISE,amount)
      player.player.deductMoney(amount)
      this._streetHighAmount = amount
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
      return action
  }

  private Check (playerId: string): Action {
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
    return action
  }

  private Fold (playerId: string): Action {
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
    return action
  }

  private Call (playerId: string): Action {
    let player = this.getPlayerData(playerId)
    let amount = this._streetHighAmount - player.streetBetAmount
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
    return action
  }
  
  private AllIn (playerId: string): Action {
    let player = this.getPlayerData(playerId)
    let amount = player.player.money
    let action = this.recordAction(playerId,ActionType.CALL,amount)
    player.player.deductMoney(amount)
    if (amount > this._streetHighAmount)
    {
      this._streetHighAmount = amount
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
    }
    return action
  }

  private setGame(hasStart = false)
  {
    let players :any[] = []
    this._history.players.forEach(element => {
    players.push(element)
    });
    this._rule = this._history.rule
    this._players = players
    this._actions = []
    if(hasStart)
    {
      this._actions = this._history.actions
      this._boardCards = this._history.BoardCards
    }
    this._buttonPlayerId = this._history.buttenPlayerId
    this._stack = this._history.stack
    this._playerDataDic = {}
    this.startGame(hasStart)
  }

  private startGame (hasStart = false)
  {
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
    for(let playerId in this._history.playerCards) 
    {
      this._playerDataDic[playerId].cards = this._history.playerCards[playerId]
    }

    if(hasStart)
    {
      this._street = this._history.street
      this._streetHighAmount = this._stack.bb
      this._streeLastPlayerId = this.getLastActionNotFold(false).playerId
      this._streetHighAmount =  this.getLastActionNotFold(true)?  this.getLastActionNotFold(true).amount:0
    }
    else
    {
      this._street = Street.PREFLOP
      this.handleSBBB()
      this._streetHighAmount = this._stack.bb
      let sbPlayer = this.getNestPlayerData(this._buttonPlayerId)
      let bbPlayer = this.getNestPlayerData(sbPlayer.player.id)
      this._streeLastPlayerId = bbPlayer.player.id
    }
  }
  
  private getPodsAmount (): number[]
  {
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
   * 处理大小盲
   */
  private handleSBBB ()
  {
    let sbPlayer = this.getNestPlayerData(this._buttonPlayerId)
    let bbPlayer = this.getNestPlayerData(sbPlayer.player.id)
    
    sbPlayer.player.deductMoney(this._stack.sb)
    this.recordAction(sbPlayer.player.id,ActionType.SB,this._stack.sb)
    bbPlayer.player.deductMoney(this._stack.bb)
    this.recordAction(bbPlayer.player.id,ActionType.BB,this._stack.bb)
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
      // console.log(" getNestActionPlayerId 游戏结束")
      // this.endGame()
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
        else if(bigId === -1) {
          let pondLast= this._pondsDic[this._pondsDic.length]
          this._pondsDic.push({base:act.amount - pondLast.max ,max:act.amount })
          return
        } else {
          let pondBig= this._pondsDic[bigId]
          pondBig.base = pondBig.max - act.amount
          let pondSmal= this._pondsDic[bigId-1]
          this._pondsDic.push({base:act.amount - pondSmal.max ,max:act.amount })
          return
        }
      }
    }
    else
    {
      if(pondCount<2) {
        if( pond0.max > act.amount) {
          // 产生边池
          pond0.base = act.amount
          pond0.max = act.amount
          this._pondsDic.push(
          {base:pond0.max - act.amount,max:pond0.max})
        } else {
          if( pond0.base === 0){ 
            pond0.base = act.amount }
          pond0.max =  pond0.max < act.amount ? act.amount:pond0.max
        }
      }else {
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
        }else
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
      case Street.RIVER:  //this.endGame()
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

  private getBoardCardGroup (): string[]
  {
    let cards:string[] = [];
    let boardCards =   this._boardCards
    switch(this._street)
    {
      case Street.PREFLOP: break
      case Street.FLOP:cards = _.slice(boardCards,0,3)
        break
      case Street.TURN:cards = _.slice(boardCards,0,4)
        break
      case Street.RIVER:cards = _.slice(boardCards,0,5)
        break
    }
    return cards
  }
  //#endregion
}
class PondsData
{
  max:number                  //池子最大注
  base:number             
}

class PlayerData
{
  player: Player
  cards:string[]
  lastActType: ActionType     // 最后一次行动类型
  index: number               // 在数组_player中的索引
  streetBetAmount: number     // 此轮投入
  betAmount: number           // 所有投入
  handRank: HandRank          // 排名
  pondGet: number             // 从所有奖池获得
}