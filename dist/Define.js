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
    Street[Street["SHOWDOWN"] = 5] = "SHOWDOWN";
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
var Position;
(function (Position) {
    Position[Position["sb"] = 0] = "sb";
    Position[Position["bb"] = 1] = "bb";
    Position[Position["ep"] = 2] = "ep";
    Position[Position["mp"] = 3] = "mp";
    Position[Position["lp"] = 4] = "lp";
    Position[Position["button"] = 5] = "button"; // 按钮位
})(Position = exports.Position || (exports.Position = {}));
// 相对于牌局其他玩家的位置
var RelactivePosition;
(function (RelactivePosition) {
    RelactivePosition[RelactivePosition["ep"] = 0] = "ep";
    RelactivePosition[RelactivePosition["mp"] = 1] = "mp";
    RelactivePosition[RelactivePosition["lp"] = 2] = "lp";
})(RelactivePosition = exports.RelactivePosition || (exports.RelactivePosition = {}));
/**
 * 牌局记录
 */
class History {
}
exports.History = History;
/**
 * 牌局记录
 */
class HistoryPlayerOptions {
}
exports.HistoryPlayerOptions = HistoryPlayerOptions;
class PlayerStatus {
}
exports.PlayerStatus = PlayerStatus;
class StreetStatus {
}
exports.StreetStatus = StreetStatus;
//# sourceMappingURL=Define.js.map