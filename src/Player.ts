
export default class Player {

  id:string 
  money:number
  seat:number
  private _misc: {[key: string]: any}

  /**
   * Creates an instance of Player.
   * @param {string} id
   * @param {number} money
   * @param {{[key: string]: any}} [misc] anything of the player
   * @memberof Player
   */
  constructor (id: string,money: number,misc?: {[key: string]: any}) {
    this.id = id
    this.money = money
    this._misc = misc
  }

  /**
   * get property of the player
   *
   * @param {string} key
   * @returns
   * @memberof Player
   */
  getMisc (key: string) {
    if (!this._misc) {
      return null
    }
    return this._misc[key]
  }

  addMoney (amount: number) {
    this.money += amount
  }

  deductMoney (amount: number) {
    this.money -= amount
  }

  resetMoney (amount: number) {
    this.money = amount
  }
}
