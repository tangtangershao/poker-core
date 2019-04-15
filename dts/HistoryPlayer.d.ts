import History, { Street, PlayerStatus, Action, StreetStatus, HistoryPlayerOptions } from "./Define";
import { Card } from "./Card";
import { CardGroup } from "./CardGroup";
export default class HistoryPlayer {
    private _history;
    constructor(options: HistoryPlayerOptions | History);
    /**
     * 获取历史纪录
    */
    getHistory(): History;
    /**
     * 增加加注记录
     * @param playerId
     * @param amount
     */
    addRaise(playerId: string, amount: number): void;
    /**
     * 增加过牌记录
     * @param playerId
     */
    addCheck(playerId: string): void;
    /**
     * 增加弃牌记录
     * @param playerId
     */
    addFold(playerId: string): void;
    /**
     * 增加跟注记录
     * @param playerId
     */
    addCall(playerId: string): void;
    /**
     * 增加全下记录
     * @param playerId
     */
    addAllIn(playerId: string): void;
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
     * 获取公共牌
     */
    getBoardCards(): CardGroup;
    /**
     * 获取当前需要行动玩家的状态
     * 如果当前街不允许行动，则返回空
     */
    getCurrentPlayerStatus(): PlayerStatus;
    /**
     * 获取玩家状态
     * @param playerId
     */
    getPlayerStatus(playerId: string): PlayerStatus;
    /**
     * 获取当前街状态
     */
    getCurrentStreet(): StreetStatus;
    /**
     * 获取根据底池比例加注大小
     * 算法：
     * * 最后加注大小（LP）最后加注大小（LP）
     * * 除最后加注以外的底池（M）
     * * 底池百分比（C）
     * * 公式： ((2*LP + M)*C) + LP
     * @param potPercent 底池百分比，默认为1
     */
    getPotSizeIfReraise(potPercent?: number): number;
    /**
     * 获取行动列表
     */
    getActions(): Action[];
    /**
     * 获取某街行动列表
     */
    getStreetActions(street: Street): Action[];
    /**
     * 获取结算结果 playerCards {[playerId: string]: CardGroup}
     */
    showDown(playerCards: {
        [playerId: string]: CardGroup;
    }, playerWins: {
        [playerId: string]: number;
    }): any;
    private getPlayerPostion;
    private getPlayerrelactivePosition;
    private getminiRaiseAmount;
    private _dealer;
    private _actions;
    private _players;
    private _rule;
    private _street;
    private _playerFinalMoneys;
    private _buttonPlayerId;
    private _stack;
    private _streetHighAmount;
    private _streeLastPlayerId;
    private _playerDataDic;
    private _pondsDic;
    private getNextPlayer;
    private getNextPlayerCurStreet;
    private Bet;
    private Raise;
    private Check;
    private Fold;
    private Call;
    private AllIn;
    private setGame;
    private startGame;
    private getPodsAmount;
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
     * 获取下个可行动玩家
     * @param playerId  默认 最后一个行动玩家Id
     */
    private getNestActionPlayerId;
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
     * 转到下一轮
     */
    private changeStreet;
    /**
     * 设置玩家手牌排名数据
     */
    private setPlayerHandRank;
    private getBoardCardGroup;
}
