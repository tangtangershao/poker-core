
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
  RIVER
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
