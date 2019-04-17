import { IRule } from "./Rule";
import { CardGroup } from "./CardGroup";

export enum ActionType {
  BET = 1,
  CALL,
  RAISE,
  ALLIN,
  FOLD,
  CHECK,
  SB,
  BB
}

export enum Street {
  PREFLOP = 1,
  FLOP,
  TURN,
  RIVER,
  SHOWDOWN
}

export class Action {
  type: ActionType
  amount?: number
  street: Street
  time: Date
  playerId: string

  /**
   *
   */
  constructor () {
    this.time = new Date()
  }
}

export class Stack{
  sb:number
  bb:number
  currency:string
}

export enum Position{
  sb,       // 小盲位
  bb,       // 大盲位
  ep,       // 前位
  mp,       // 中位
  lp,       // 后位
  button    // 按钮位
}


// 相对于牌局其他玩家的位置
export enum RelactivePosition{
  ep,       // 前位  我是第一个行动的
  mp,       // 中位  我是中间行动的
  lp,       // 后位  我是最后一个行动的
}

export interface GameResult{
  pot:number    // 总底池
  rake:number   // 总共抽水
  // 玩家赢了多少钱
  playerWins:{[playerId: string]: number}
  // 玩家从池子里分到多少钱
  playerCollects:{[playerId: string]: number}
}

/**
 * 牌局记录
 */
export class History {

  // 当前街显示的全部牌
  BoardCards: string[]

  playerCards: {[playerId: string]: string[]}

  // 当rule为空的时候，默认使用德州6人台规则
  rule?: IRule

  // 平台名称
  platform:string

  // 当前街
  street: Street
  
  // 玩家列表
  players: {id:string,money:number,seat:number,misc: {[key: string]: any}}[]
  
  // 按钮位置玩家id
  buttenPlayerId:string
  
  // 游戏编号
  gameId:number

  // 游戏开始时间
  startTime: Date

  // 玩家行动列表
  actions:Action[]

  stack: Stack

  // 玩家赢了多少钱
  playerWins:{[playerId: string]: number}
  
  // 玩家从池子里分到多少钱
  playerCollects:{[playerId: string]: number}
}


/**
 * 牌局记录
 */
export class HistoryPlayerOptions {

  playerCards: {[playerId: string]: string[]}

  // 当rule为空的时候，默认使用德州6人台规则
  rule?: IRule

  // 平台名称
  platform:string
  
  // 玩家列表
  players: {id:string,money:number,seat:number,misc: {[key: string]: any}}[]
  
  // 按钮位置玩家id
  buttenPlayerId:string
  
  // 游戏编号
  gameId:number

  // 游戏开始时间
  startTime: Date

  stack: Stack
}



export class PlayerStatus{
  playerId:number
  money:number
  seat:number
  isMyTurn:boolean
  position:Position
  relactivePosition:RelactivePosition
  miniRaiseAmount?:number   //最小加注额 当前街上一个下注或者加注玩家的两倍 flop圈若无人加注为大盲两倍 turn river圈无人加注则为大盲 
}


export class StreetStatus{
  street:Street
  playerCount:number    //除fold玩家外所有玩家数量
  players:number[]
  pot:number[]          //池子及金额
  potTotal:number       //池子总金额
  lastBet:number        //最后下注大小
}