"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dealer_1 = require("./Dealer");
const Define_1 = require("./Define");
const _ = require("lodash");
const OddsCalculator_1 = require("./OddsCalculator");
var gameStatus;
(function (gameStatus) {
    gameStatus[gameStatus["NOTSTART"] = 0] = "NOTSTART";
    gameStatus[gameStatus["START"] = 1] = "START";
    gameStatus[gameStatus["END"] = 2] = "END";
})(gameStatus || (gameStatus = {}));
class Game {
    /**
     *
     * @throws CanNotFindButtonPlayerError
     * @throws PlayersIsNotEnoughForGameError
     */
    constructor(rule, players, stack, buttonPlayerId) {
        this._dealer = new Dealer_1.default(rule);
        this._rule = rule;
        this._players = players;
        this._startTime = new Date();
        this._actions = [];
        this._buttonPlayerId = buttonPlayerId;
        this._stack = stack;
        this._gameStatus = gameStatus.NOTSTART;
        this._playerDataDic = {};
    }
    /**
     * get next player that need to action
     *
     * @returns {PlayerData}
     * @memberof Game
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     */
    getNextPlayer() {
        this.checkGameStart();
        let nestPlayerId = this.getNestActionPlayerId();
        return this._playerDataDic[nestPlayerId];
    }
    /**
     * Player bet
     *
     * @param {string} playerId
     * @param {number} [actionAmount]
     * @returns {Action}
     * @throws PlayerNotHaveEnoughMoneyError
     * @throws NotPlayerTurnToActionError
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     * @throws CanNotActionAtStreet
     * @memberof Game
     */
    Bet(playerId, amount) {
        this.canAction(playerId);
        this.conditionAction(playerId, Define_1.ActionType.BET);
        let player = this.getPlayerData(playerId);
        if (player.player.money > amount) {
            let action = this.recordAction(playerId, Define_1.ActionType.BET, amount);
            player.player.deductMoney(amount);
            this._streetHighAmount = amount;
            this._streeLastPlayerId = this.getLastActionNotFold(false).playerId;
            this.isGameEnd();
            return action;
        }
        else {
            throw new PlayerNotHaveEnoughMoneyError(` player  ${playerId}  money is not enough to bet  ${amount}`);
        }
    }
    /**
     * Player Raise
     *
     * @param {string} playerId
     * @param {number} [actionAmount]
     * @returns {Action}
     * @throws PlayerNotHaveEnoughMoneyError
     * @throws NotPlayerTurnToActionError
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     * @throws CanNotActionAtStreet
     * @memberof Game
     */
    Raise(playerId, amount) {
        this.canAction(playerId);
        this.conditionAction(playerId, Define_1.ActionType.RAISE);
        let player = this.getPlayerData(playerId);
        if (player.player.money > amount) {
            let action = this.recordAction(playerId, Define_1.ActionType.RAISE, amount);
            player.player.deductMoney(amount);
            this._streetHighAmount = amount;
            this._streeLastPlayerId = this.getLastActionNotFold(false).playerId;
            this.isGameEnd();
            return action;
        }
        else {
            throw new PlayerNotHaveEnoughMoneyError(` player  ${playerId}  money is not enough to raise  ${amount}`);
        }
    }
    /**
     * Player Check
     *
     * @param {string} playerId
     * @returns {Action}
     * @throws PlayerNotHaveEnoughMoneyError
     * @throws NotPlayerTurnToActionError
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     * @throws CanNotActionAtStreet
     * @memberof Game
     */
    Check(playerId) {
        this.canAction(playerId);
        this.conditionAction(playerId, Define_1.ActionType.CHECK);
        let action = this.recordAction(playerId, Define_1.ActionType.CHECK);
        if (playerId === this._streeLastPlayerId) {
            this.changeStreet();
        }
        this.isGameEnd();
        return action;
    }
    /**
     * Player Fold
     *
     * @param {string} playerId
     * @returns {Action}
     * @throws PlayerNotHaveEnoughMoneyError
     * @throws NotPlayerTurnToActionError
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     * @throws CanNotActionAtStreet
     * @memberof Game
     */
    Fold(playerId) {
        this.canAction(playerId);
        this.conditionAction(playerId, Define_1.ActionType.FOLD);
        let player = this.getPlayerData(playerId);
        let action = this.recordAction(playerId, Define_1.ActionType.FOLD);
        if (playerId === this._streeLastPlayerId) {
            this.changeStreet();
        }
        this.isGameEnd();
        return action;
    }
    /**
     * Player Call
     *
     * @param {string} playerId
     * @returns {Action}
     * @throws PlayerNotHaveEnoughMoneyError
     * @throws NotPlayerTurnToActionError
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     * @throws CanNotActionAtStreet
     * @memberof Game
     */
    Call(playerId) {
        this.canAction(playerId);
        this.conditionAction(playerId, Define_1.ActionType.CALL);
        let player = this.getPlayerData(playerId);
        let amount = this._streetHighAmount - player.streetBetAmount;
        if (player.player.money > amount) {
            let action = this.recordAction(playerId, Define_1.ActionType.CALL, amount);
            player.player.deductMoney(amount);
            if (playerId === this._streeLastPlayerId) {
                this.changeStreet();
            }
            this.isGameEnd();
            return action;
        }
        else {
            throw new PlayerNotHaveEnoughMoneyError(` player  ${playerId}  money is not enough to Call  ${amount}`);
        }
    }
    /**
     * Player AllIn
     *
     * @param {string} playerId
     * @returns {Action}
     * @throws PlayerNotHaveEnoughMoneyError
     * @throws NotPlayerTurnToActionError
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     * @throws CanNotActionAtStreet
     * @memberof Game
     */
    AllIn(playerId) {
        this.canAction(playerId);
        this.conditionAction(playerId, Define_1.ActionType.ALLIN);
        let player = this.getPlayerData(playerId);
        let amount = player.player.money;
        let action = this.recordAction(playerId, Define_1.ActionType.CALL, amount);
        player.player.deductMoney(amount);
        if (amount > this._streetHighAmount) {
            this._streetHighAmount = amount;
            this._streeLastPlayerId = this.getLastActionNotFold(false).playerId;
        }
        this.isGameEnd();
        return action;
    }
    /**
     * get hole cards of all players
     * @throws GameIsNotStartError
     * @returns {{[playerId: string]: CardGroup;}}
     * @memberof Game
     */
    getHoleCards() {
        if (this._gameStatus === gameStatus.NOTSTART) {
            throw new GameIsNotStartError();
        }
        return this._dealer.getDealtCards();
    }
    /**
     * start this game
     * step.1 post sb,bb
     * step.2 dealer shuffle
     * step.3 dealer deal cards
     * step.4 change gameStatus to start
     * step.5 change street to preflop
     * @returns {Action}
     * @throws GameIsEndError
     * @throws GameIsStartedError
     * @memberof Game
     */
    startGame() {
        if (this._gameStatus === gameStatus.START) {
            throw new GameIsStartedError();
        }
        else if (this._gameStatus === gameStatus.END) {
            throw new GameIsEndError();
        }
        let playerIds = [];
        for (let i = 0; i < this._players.length; i++) {
            playerIds.push(this._players[i].id);
            this._playerDataDic[this._players[i].id] = {
                player: this._players[i],
                cards: null,
                lastActType: 0,
                index: i,
                streetBetAmount: 0,
                betAmount: 0,
                handRank: null,
                pondGet: 0
            };
        }
        this._street = Define_1.Street.PREFLOP;
        this.handleSBBB();
        this._dealer.shuffle();
        this._dealer.dealAll(playerIds);
        this._gameStatus = gameStatus.START;
        for (let playerId in this._dealer.getDealtCards()) {
            this._playerDataDic[playerId].cards = this._dealer.getDealtCards()[playerId];
        }
        this._streetHighAmount = this._stack.bb;
        let sbPlayer = this.getNestPlayerData(this._buttonPlayerId);
        let bbPlayer = this.getNestPlayerData(sbPlayer.player.id);
        this._streeLastPlayerId = bbPlayer.player.id;
    }
    /**
     * end this game
     * step.1 calculate players final money
     * step.2 change gameStatus to end
     * @throws GameIsEndError
     * @throws GameIsNotStartError
     * @memberof Game
     */
    endGame() {
        if (this._gameStatus === gameStatus.NOTSTART) {
            throw new GameIsNotStartError();
        }
        else if (this._gameStatus === gameStatus.END) {
            throw new GameIsEndError();
        }
        this.changeStreet();
        this.setPlayerHandRank();
        this.calculatorPond();
        this._gameStatus = gameStatus.END;
    }
    /**
     * get the amount of every pod ,this first is pot ,the others are side_pod
     * @throws GameIsNotStartError
     */
    getPodsAmount() {
        if (this._gameStatus === gameStatus.NOTSTART) {
            throw new GameIsNotStartError();
        }
        let podsAmount = [];
        let pondBases = [];
        for (let playerId in this._playerDataDic) {
            if (this._playerDataDic[playerId].betAmount !== 0) {
                pondBases.push(this._playerDataDic[playerId].betAmount);
            }
        }
        pondBases = _.sortedUniq(pondBases);
        pondBases = _.sortBy(pondBases);
        for (let i = 0; i < pondBases.length; i++) {
            let pondPlayerCount = 0;
            for (let playerId in this._playerDataDic) {
                if (this._playerDataDic[playerId].betAmount >= pondBases[i]) {
                    pondPlayerCount = pondPlayerCount + 1;
                }
            }
            let pondAmount = 0;
            if (i === 0) // 底池
             {
                pondAmount = pondPlayerCount * pondBases[i];
            }
            else {
                let base = pondBases[i] - pondBases[i - 1];
                pondAmount = pondPlayerCount * base;
            }
            podsAmount.push(pondAmount);
        }
        return podsAmount;
    }
    /**
     * 检查是否在游戏中
     */
    checkGameStart() {
        if (this._gameStatus === gameStatus.NOTSTART) {
            throw new GameIsNotStartError();
        }
        else if (this._gameStatus === gameStatus.END) {
            throw new GameIsEndError();
        }
    }
    /**
     * 处理大小盲
     */
    handleSBBB() {
        let sbPlayer = this.getNestPlayerData(this._buttonPlayerId);
        let bbPlayer = this.getNestPlayerData(sbPlayer.player.id);
        if (sbPlayer.player.money < this._stack.sb) {
            throw new PlayersIsNotEnoughForGameError();
        }
        else {
            sbPlayer.player.deductMoney(this._stack.sb);
            let action = this.recordAction(sbPlayer.player.id, Define_1.ActionType.SB, this._stack.sb);
        }
        if (bbPlayer.player.money < this._stack.bb) {
            throw new PlayersIsNotEnoughForGameError();
        }
        else {
            bbPlayer.player.deductMoney(this._stack.bb);
            let action = this.recordAction(bbPlayer.player.id, Define_1.ActionType.BB, this._stack.bb);
        }
    }
    /**
     * 根据玩家id获取玩家状态信息
     * @param playerId
     */
    getPlayerData(playerId) {
        return this._playerDataDic[playerId];
    }
    /**
     * 获取下个玩家状态信息
     * @param playerId 玩家id
     */
    getNestPlayerData(playerId) {
        let index = this._playerDataDic[playerId].index;
        index = index + 1;
        if (index === this._players.length) {
            index = 0;
        }
        let nextPlayerId = this._players[index].id;
        return this._playerDataDic[nextPlayerId];
    }
    /**
     * 获取上个玩家状态信息
     * @param playerId 玩家id
     */
    getLastPlayerData(playerId) {
        let index = this._playerDataDic[playerId].index;
        index = index - 1;
        if (index === -1) {
            index = this._players.length - 1;
        }
        let lastPlayerId = this._players[index].id;
        return this._playerDataDic[lastPlayerId];
    }
    /**
     * 获取下个可行动玩家
     * @param playerId  默认 最后一个行动玩家Id
     */
    getNestActionPlayerId(playerId) {
        if (!playerId) {
            playerId = this._actions[this._actions.length - 1].playerId;
        }
        let nestPlayer = this.getNestPlayerData(playerId);
        let nestPlayerId = nestPlayer.player.id;
        if (nestPlayerId === this._actions[this._actions.length - 1].playerId) {
            console.log(" getNestActionPlayerId 游戏结束");
            this.endGame();
        }
        if (nestPlayer.lastActType === Define_1.ActionType.FOLD || nestPlayer.lastActType === Define_1.ActionType.ALLIN) {
            return this.getNestActionPlayerId(nestPlayerId);
        }
        else {
            return nestPlayerId;
        }
    }
    /**
     * 检查一轮结束是否只剩一个可行动者
     */
    isGameEnd() {
        let lastAction = this.getLastActionNotFold(true);
        if (lastAction) {
            let foldCount = 0;
            for (let playerId in this._playerDataDic) {
                if (this._playerDataDic[playerId].lastActType === Define_1.ActionType.FOLD) {
                    foldCount = foldCount + 1;
                }
            }
            if (foldCount === _.size(this._playerDataDic) - 1) {
                this.endGame();
            }
            return;
        }
        else {
            let canActionCount = 0;
            for (let playerId in this._playerDataDic) {
                if (this._playerDataDic[playerId].lastActType !== Define_1.ActionType.FOLD &&
                    this._playerDataDic[playerId].lastActType !== Define_1.ActionType.ALLIN) {
                    canActionCount = canActionCount + 1;
                }
            }
            if (canActionCount === 1) {
                this.endGame();
            }
        }
    }
    /**
     * 记录行动
     * @param playerData 玩家状态信息
     * @param actionType 行动类型
     * @param amount 行动金额
     */
    recordAction(playerId, actionType, amount) {
        let playerData = this._playerDataDic[playerId];
        let action = new Define_1.Action();
        action.playerId = playerData.player.id;
        action.type = actionType;
        action.street = this._street;
        action.amount = 0;
        if (amount) {
            action.amount = amount;
        }
        this._actions.push(action);
        playerData.lastActType = actionType;
        let streetBetAmount = playerData.streetBetAmount + action.amount;
        playerData.streetBetAmount = streetBetAmount;
        return action;
    }
    /**
     * 获取上次有效行动（盖牌和每轮开始 返回空行动 因为无法用来判定下次行动）
     */
    getLastActionNotFold(mustSameStreet) {
        for (let i = this._actions.length - 1; i > 0; i--) {
            let action = this._actions[i];
            if (mustSameStreet) {
                if (action.street === this._street) // 同一轮
                 {
                    if (action.type !== Define_1.ActionType.FOLD) {
                        return action;
                    }
                }
            }
            else {
                if (action.type !== Define_1.ActionType.FOLD && action.type !== Define_1.ActionType.ALLIN) {
                    return action;
                }
            }
        }
        return null;
    }
    /**
     * 根据上次行动类型 判定下次可行动类型列表
     * @param actionType 上次行动类型
     */
    nestActionCanDo(actionType) {
        let canActs = [];
        switch (actionType) {
            case Define_1.ActionType.BET:
            case Define_1.ActionType.CALL:
            case Define_1.ActionType.RAISE:
            case Define_1.ActionType.BB:
                canActs.push(Define_1.ActionType.CALL);
                canActs.push(Define_1.ActionType.FOLD);
                canActs.push(Define_1.ActionType.RAISE);
                canActs.push(Define_1.ActionType.ALLIN);
                break;
            case Define_1.ActionType.CHECK:
                canActs.push(Define_1.ActionType.CHECK);
                canActs.push(Define_1.ActionType.FOLD);
                canActs.push(Define_1.ActionType.BET);
                canActs.push(Define_1.ActionType.ALLIN);
                break;
            case Define_1.ActionType.ALLIN:
                canActs.push(Define_1.ActionType.CALL);
                canActs.push(Define_1.ActionType.FOLD);
                canActs.push(Define_1.ActionType.RAISE);
                canActs.push(Define_1.ActionType.ALLIN);
                break;
            case Define_1.ActionType.SB:
                break;
            case Define_1.ActionType.FOLD:
                break;
            default: // i am the first
                canActs.push(Define_1.ActionType.CHECK);
                canActs.push(Define_1.ActionType.FOLD);
                canActs.push(Define_1.ActionType.BET);
                canActs.push(Define_1.ActionType.ALLIN);
                break;
        }
        return canActs;
    }
    /**
     * 判定玩家可否参与行动
     * @param playerId 玩家id
     */
    canAction(playerId) {
        this.checkGameStart();
        let playerData = this._playerDataDic[playerId];
        if (playerData.lastActType === Define_1.ActionType.FOLD || playerData.lastActType === Define_1.ActionType.ALLIN) {
            throw new NotPlayerTurnToActionError(` player ${playerData.player.id} is fold or allin  ,can not action any more `);
        }
        if (this.getNestActionPlayerId() !== playerId) {
            throw new NotPlayerTurnToActionError(`nest action player is not ${playerId}`);
        }
    }
    /**
     * 判定玩家行动条件是否满足
     * @param playerId 玩家id
     * @param actionType 行动类型
     */
    conditionAction(playerId, actionType) {
        // 大小盲proflop这一轮特殊处理
        if (this._playerDataDic[playerId].lastActType === Define_1.ActionType.BB && this._playerDataDic[playerId].streetBetAmount === this._streetHighAmount) {
            if (actionType === Define_1.ActionType.CALL) {
                throw new CanNotActionAtStreetError(`nest action  not allowd player ${playerId} action -${actionType}`);
            }
            else if (actionType === Define_1.ActionType.CHECK) {
                return;
            }
        }
        let lastAction = this.getLastActionNotFold(true);
        let lastActionType = 0;
        if (lastAction) {
            lastActionType = lastAction.type;
        }
        let canActs = this.nestActionCanDo(lastActionType);
        let haveAct = false;
        for (let act of canActs) {
            if (actionType === act) {
                haveAct = true;
                break;
            }
        }
        if (!haveAct) {
            throw new CanNotActionAtStreetError(`nest action  not allowd player ${playerId} action -${actionType}`);
        }
    }
    /**
     * 转到下一轮
     */
    changeStreet() {
        let curStreet = this._street;
        switch (curStreet) {
            case Define_1.Street.PREFLOP:
                this._street = Define_1.Street.FLOP;
                break;
            case Define_1.Street.FLOP:
                this._street = Define_1.Street.TURN;
                break;
            case Define_1.Street.TURN:
                this._street = Define_1.Street.RIVER;
                break;
            default:
                break;
        }
        for (let playerId in this._playerDataDic) {
            let amoumt = this._playerDataDic[playerId].streetBetAmount;
            this._playerDataDic[playerId].streetBetAmount = 0;
            this._playerDataDic[playerId].betAmount = this._playerDataDic[playerId].betAmount + amoumt;
        }
        this._streeLastPlayerId = "";
        this._streetHighAmount = 0;
    }
    /**
     * 设置玩家手牌排名数据
     */
    setPlayerHandRank() {
        let playerCards = this._dealer.getDealtCards();
        let newPlayerCard = [];
        let newPlayerId = [];
        for (let playerId in this._playerDataDic) {
            newPlayerCard.push(playerCards[playerId]);
            newPlayerId.push(playerId);
        }
        let oddsCalculator = OddsCalculator_1.OddsCalculator.calculate(newPlayerCard, this._dealer.getBoardCards());
        for (let i = 0; i < newPlayerCard.length; i++) {
            let handRank = oddsCalculator.getHandRank(i);
            this._playerDataDic[newPlayerId[i]].handRank = handRank;
        }
    }
    /**
     * 获取玩家排名
     * @param playerId 玩家Id
     */
    getPlayerRank(playerId) {
        if (this._playerDataDic[playerId].handRank) {
            return this._playerDataDic[playerId].handRank.getRank();
        }
        return 0;
    }
    /**
     * 获取列表中排名最高玩家列表
     * @param players
     */
    getHighRankPlayer(players) {
        let highers = [];
        let sortPondPlayer = _.sortBy(players, [function (o) { return -o.rank; }]);
        let firstRank = sortPondPlayer[0].rank;
        for (let i = 0; i < sortPondPlayer.length; i++) {
            if (sortPondPlayer[i].rank === firstRank) {
                highers.push(sortPondPlayer[i].playerId);
            }
        }
        if (highers.length === 1) {
            return highers;
        }
        else if (highers.length > 1) {
            let result = [];
            let first = highers[0];
            let firstHandRank = this._playerDataDic[highers[0]].handRank;
            for (let i = 1; i < highers.length; i++) {
                let handRank = this._playerDataDic[highers[i]].handRank;
                if (firstHandRank.compareTo(handRank) === 1) {
                    first = highers[i];
                    firstHandRank = handRank;
                }
            }
            for (let i = 0; i < highers.length; i++) {
                let handRank = this._playerDataDic[highers[i]].handRank;
                if (firstHandRank.compareTo(handRank) === 0) {
                    result.push(first);
                }
            }
            return result;
        }
        return null;
    }
    /**
     * 结算所有池子
     */
    calculatorPond() {
        let pondBases = [];
        for (let playerId in this._playerDataDic) {
            if (this._playerDataDic[playerId].betAmount !== 0) {
                pondBases.push(this._playerDataDic[playerId].betAmount);
            }
        }
        pondBases = _.sortedUniq(pondBases);
        pondBases = _.sortBy(pondBases);
        for (let i = 0; i < pondBases.length; i++) {
            let pondPlayers = [];
            for (let playerId in this._playerDataDic) {
                if (this._playerDataDic[playerId].betAmount >= pondBases[i]) {
                    pondPlayers.push({ rank: this.getPlayerRank(playerId), playerId: playerId });
                }
            }
            let pondAmount = 0;
            if (i === 0) // 底池
             {
                pondAmount = _.size(pondPlayers) * pondBases[i];
            }
            else {
                let base = pondBases[i] - pondBases[i - 1];
                pondAmount = _.size(pondPlayers) * base;
            }
            let winners = this.getHighRankPlayer(pondPlayers);
            //console.log(" 池子所有玩家 ",pondPlayers," 池子 获胜者 ",winners)
            for (let i = 0; i < winners.length; i++) {
                let amount = this._playerDataDic[winners[i]].pondGet + pondAmount / winners.length;
                this._playerDataDic[winners[i]].pondGet = amount;
            }
        }
        this.setPlayerFinalMoney();
    }
    /**
     * 计算玩家最终金币数
     */
    setPlayerFinalMoney() {
        this._playerFinalMoneys = {};
        for (let playerId in this._playerDataDic) {
            let player = this._playerDataDic[playerId];
            player.player.addMoney(player.pondGet);
            this._playerFinalMoneys[playerId] = player.player.money;
        }
    }
    //* 暂存 测试用到
    getAllActions() {
        return this._actions;
    }
    getPlayerDataDic() {
        return this._playerDataDic;
    }
    getPlayerMoneys() {
        return this._playerFinalMoneys;
    }
    getBoardCardGroup() {
        return this._dealer.getBoardCards();
    }
    getStreet() {
        return this._street;
    }
    getStack() {
        return this._stack;
    }
    isEnd() {
        return this._gameStatus === gameStatus.END;
    }
}
exports.default = Game;
class PlayerData {
}
exports.PlayerData = PlayerData;
class PlayerNotHaveEnoughMoneyError extends Error {
}
exports.PlayerNotHaveEnoughMoneyError = PlayerNotHaveEnoughMoneyError;
class NotPlayerTurnToActionError extends Error {
}
exports.NotPlayerTurnToActionError = NotPlayerTurnToActionError;
class GameIsStartedError extends Error {
}
exports.GameIsStartedError = GameIsStartedError;
class GameIsNotStartError extends Error {
}
exports.GameIsNotStartError = GameIsNotStartError;
class GameIsEndError extends Error {
}
exports.GameIsEndError = GameIsEndError;
class CanNotActionAtStreetError extends Error {
}
exports.CanNotActionAtStreetError = CanNotActionAtStreetError;
class CanNotFindButtonPlayerError extends Error {
}
exports.CanNotFindButtonPlayerError = CanNotFindButtonPlayerError;
class PlayersIsNotEnoughForGameError extends Error {
}
exports.PlayersIsNotEnoughForGameError = PlayersIsNotEnoughForGameError;
//# sourceMappingURL=Game.js.map