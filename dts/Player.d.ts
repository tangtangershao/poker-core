export default class Player {
    id: string;
    money: number;
    seat: number;
    private _misc;
    /**
     * Creates an instance of Player.
     * @param {string} id
     * @param {number} money
     * @param {{[key: string]: any}} [misc] anything of the player
     * @memberof Player
     */
    constructor(id: string, money: number, misc?: {
        [key: string]: any;
    });
    /**
     * get property of the player
     *
     * @param {string} key
     * @returns
     * @memberof Player
     */
    getMisc(key: string): any;
    addMoney(amount: number): void;
    deductMoney(amount: number): void;
    resetMoney(amount: number): void;
}
