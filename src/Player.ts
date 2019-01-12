
export default class Player {

  get id(): string { return this.id }
  get money(): number { return this._money }
  private _id: string
  private _misc: {[key: string]: any}
  private _money: number

  /**
   * Creates an instance of Player.
   * @param {string} id
   * @param {number} money
   * @param {{[key: string]: any}} [misc] anything of the player
   * @memberof Player
   */
  constructor (id: string,money: number,misc?: {[key: string]: any}) {
    this._id = id
    this._money = money
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
    this._money += amount
  }

  deductMoney (amount: number) {
    this._money -= amount
  }

  resetMoney (amount: number) {
    this._money = 10000
  }
}
