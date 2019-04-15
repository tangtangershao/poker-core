import { Action, Street, ActionType, Stack } from './Define';
import Player from './Player';
import { IRule } from './Rule';
import { CardGroup, HandRank } from '.';
import { Card } from "./Card";
export default class Game {
    readonly gameId: number;
    private _dealer;
    private _actions;
    private _players;
    private _startTime;
    private _rule;
    private _street;
    private _boardCards;
    private _playerFinalMoneys;
    private _buttonPlayerId;
    private _stack;
    private _gameStatus;
    private _streetHighAmount;
    private _streeLastPlayerId;
    private _playerDataDic;
    private _pondsDic;
    /**
     *
     * @throws CanNotFindButtonPlayerError
     * @throws PlayersIsNotEnoughForGameError
     */
    constructor(gameId: number, rule: IRule, players: Player[], stack: Stack, buttonPlayerId: string);
    /**
     * get next player that need to action
     *
     * @returns {PlayerData}
     * @memberof Game
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     */
    getNextPlayer(): PlayerData;
    /**
     * get next player cur street that need to action
     *
     * @returns {PlayerData}
     * @memberof Game
     * @throws GameIsNotStartError
     * @throws GameIsEndError
     */
    getNextPlayerCurStreet(): PlayerData;
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
    Bet(playerId: string, amount: number): Action;
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
    Raise(playerId: string, amount: number): Action;
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
    Check(playerId: string): Action;
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
    Fold(playerId: string): Action;
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
    Call(playerId: string): Action;
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
    AllIn(playerId: string): Action;
    /**
     * get hole cards of all players
     * @throws GameIsNotStartError
     * @returns {{[playerId: string]: CardGroup;}}
     * @memberof Game
     */
    getHoleCards(): {
        [playerId: string]: CardGroup;
    };
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
    startGame(): void;
    /**
     * end this game
     * step.1 calculate players final money
     * step.2 change gameStatus to end
     * @throws GameIsEndError
     * @throws GameIsNotStartError
     * @memberof Game
     */
    endGame(): void;
    /**
     * get the amount of every pod ,this first is pot ,the others are side_pod
     * @throws GameIsNotStartError
     */
    getPodsAmount(): number[];
    /**
     * 检查是否在游戏中
     */
    private checkGameStart;
    /**
     * 处理大小盲
     */
    private handleSBBB;
    /**
     * 根据玩家id获取玩家状态信息
     * @param playerId
     */
    private getPlayerData;
    /**
     * 获取下个玩家状态信息
     * @param playerId 玩家id
     */
    private getNestPlayerData;
    /**
     * 获取上个玩家状态信息
     * @param playerId 玩家id
     */
    private getLastPlayerData;
    /**
     * 获取下个可行动玩家
     * @param playerId  默认 最后一个行动玩家Id
     */
    private getNestActionPlayerId;
    /**
     * 检查一轮结束是否只剩一个可行动者
     */
    private isGameEnd;
    /**
     * 记录行动
     * @param playerData 玩家状态信息
     * @param actionType 行动类型
     * @param amount 行动金额
     */
    private recordAction;
    private setPonds;
    /**
     * 获取上次有效行动（盖牌和每轮开始 返回空行动 因为无法用来判定下次行动）
     */
    private getLastActionNotFold;
    /**
    * 获取此轮最高下注
    */
    getLastActionBet(): number;
    /**
     * 根据上次行动类型 判定下次可行动类型列表
     * @param actionType 上次行动类型
     */
    private nestActionCanDo;
    /**
     * 判定玩家可否参与行动
     * @param playerId 玩家id
     */
    private canAction;
    /**
     * 判定玩家行动条件是否满足
     * @param playerId 玩家id
     * @param actionType 行动类型
     */
    private conditionAction;
    /**
     * 转到下一轮
     */
    private changeStreet;
    /**
      * 设置翻牌圈的牌
      * @param cards
      */
    setFlopCards(cards: Card[]): void;
    /**
     * 设置转牌圈的牌
     * @param card
     */
    setTurnCards(card: Card): void;
    /**
     * 设置河牌圈的牌
     * @param card
     */
    setRiverCards(card: Card): void;
    /**
     * 设置玩家手牌排名数据
     */
    private setPlayerHandRank;
    /**
     * 获取玩家排名
     * @param playerId 玩家Id
     */
    private getPlayerRank;
    /**
     * 获取列表中排名最高玩家列表
     * @param players
     */
    private getHighRankPlayer;
    /**
     * 结算所有池子
     */
    private calculatorPond;
    /**
     * 计算玩家最终金币数
     */
    private setPlayerFinalMoney;
    getAllActions(): Action[];
    getPlayerDataDic(): any;
    getPlayerMoneys(): any;
    getBoardCardGroup(): CardGroup;
    getStreet(): Street;
    getStack(): Stack;
    isEnd(): boolean;
    btnPlayerId(): string;
}
export declare class PlayerData {
    player: Player;
    cards: CardGroup;
    lastActType: ActionType;
    index: number;
    streetBetAmount: number;
    betAmount: number;
    handRank: HandRank;
    pondGet: number;
}
export declare class PlayerNotHaveEnoughMoneyError extends Error {
}
export declare class NotPlayerTurnToActionError extends Error {
}
export declare class GameIsStartedError extends Error {
}
export declare class GameIsNotStartError extends Error {
}
export declare class GameIsEndError extends Error {
}
export declare class CanNotActionAtStreetError extends Error {
}
export declare class CanNotFindButtonPlayerError extends Error {
}
export declare class PlayersIsNotEnoughForGameError extends Error {
}
