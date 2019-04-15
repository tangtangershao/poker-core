"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    /**
     * Creates an instance of Player.
     * @param {string} id
     * @param {number} money
     * @param {{[key: string]: any}} [misc] anything of the player
     * @memberof Player
     */
    constructor(id, money, misc) {
        this.id = id;
        this.money = money;
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
        this.money += amount;
    }
    deductMoney(amount) {
        this.money -= amount;
    }
    resetMoney(amount) {
        this.money = amount;
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map