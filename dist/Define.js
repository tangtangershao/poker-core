"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionType;
(function (ActionType) {
    ActionType[ActionType["BET"] = 1] = "BET";
    ActionType[ActionType["CALL"] = 2] = "CALL";
    ActionType[ActionType["RAISE"] = 3] = "RAISE";
    ActionType[ActionType["ALLIN"] = 4] = "ALLIN";
    ActionType[ActionType["FOLD"] = 5] = "FOLD";
    ActionType[ActionType["CHECK"] = 6] = "CHECK";
    ActionType[ActionType["SB"] = 7] = "SB";
    ActionType[ActionType["BB"] = 8] = "BB";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var Street;
(function (Street) {
    Street[Street["PREFLOP"] = 1] = "PREFLOP";
    Street[Street["FLOP"] = 2] = "FLOP";
    Street[Street["TURN"] = 3] = "TURN";
    Street[Street["RIVER"] = 4] = "RIVER";
})(Street = exports.Street || (exports.Street = {}));
class Action {
    /**
     *
     */
    constructor() {
        this.time = new Date();
    }
}
exports.Action = Action;
class Stack {
}
exports.Stack = Stack;
//# sourceMappingURL=Define.js.map