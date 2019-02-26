"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    get id() { return this._id; }
    get money() { return this._money; }
    /**
     * Creates an instance of Player.
     * @param {string} id
     * @param {number} money
     * @param {{[key: string]: any}} [misc] anything of the player
     * @memberof Player
     */
    constructor(id, money, misc) {
        this._id = id;
        this._money = money;
        this._misc = misc;
    }
    /**
     * get property of the player
     *
     * @param {string} key
     * @returns
     * @memberof Player
     */
    getMisc(key) {
        if (!this._misc) {
            return null;
        }
        return this._misc[key];
    }
    addMoney(amount) {
        this._money += amount;
    }
    deductMoney(amount) {
        this._money -= amount;
    }
    resetMoney(amount) {
        this._money = 10000;
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map