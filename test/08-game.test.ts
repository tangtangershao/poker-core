/**
 * Tests for Card class
 */
import { Card, Rank, Suit } from '../src/index'
import Game, { CanNotActionAtStreetError, NotPlayerTurnToActionError, PlayerNotHaveEnoughMoneyError, GameIsNotStartError } from '../src/Game'
import { IRule, FullDeckRule } from '../src/Rule'
import { Stack } from '../src/Define'
import Player from '../src/Player'
import { GameIsEndError } from '../src/Game';

  test('getNestPlayer()', () => {
    const rule = new FullDeckRule()
    const players = []
    for ( let i = 1;i < 6;i++)
    {
      let player = new Player(i.toString(),100 * i)
      players.push(player)
    }
    const strack = new Stack()
    strack.bb = 50
    strack.sb = 25
    strack.currency = "RMB"
    const game = new Game(rule,players,strack,"4")
    game.startGame()
    game.getHoleCards()
    game.Fold("2")
    game.Call("3")
    game.Fold("4")
    game.Fold("5")
    game.Call("1")
    expect(game.getNextPlayer().id).toEqual("3")
  })

  test('bet()', () => {
    const rule = new FullDeckRule()
    const players = []
    for ( let i = 1;i < 6;i++)
    {
      let player = new Player(i.toString(),100 * i)
      players.push(player)
    }

    const strack = new Stack()
    strack.bb = 50
    strack.sb = 25
    strack.currency = "RMB"
    const game = new Game(rule,players,strack,"4")
    expect(()=>{game.Bet("2",100)}).toThrow(GameIsNotStartError)

    game.startGame()

    game.Fold("2")
    expect(()=>{game.Bet("3",100)}).toThrow(CanNotActionAtStreetError)
    expect(()=>{game.Bet("4",100)}).toThrow(NotPlayerTurnToActionError)
    game.Call("3")
    game.Fold("4")
    game.Fold("5")
    game.Call("1")
    expect(()=>{game.Bet("3",700)}).toThrow(PlayerNotHaveEnoughMoneyError)

    game.AllIn("3")
    game.AllIn("1")
    game.endGame()
    expect(()=>{game.Bet("2",100)}).toThrow(GameIsEndError)

  })

  test('Raise()', () => {
    const rule = new FullDeckRule()
    const players = []
    for ( let i = 1;i < 6;i++)
    {
      let player = new Player(i.toString(),100 * i)
      players.push(player)
    }
    const strack = new Stack()
    strack.bb = 50
    strack.sb = 25
    strack.currency = "RMB"
    const game = new Game(rule,players,strack,"4")
    expect(()=>{game.Raise("2",100)}).toThrow(GameIsNotStartError)
    game.startGame()

    // game.Raise("2",100)
    // game.Call("3")
    // game.Fold("4")
    // game.Fold("5")
    // game.Call("1")
    // game.AllIn("3")
    // game.AllIn("1")
    // game.endGame()

  })
//   test('bet()', () => {
//     const rule = new FullDeckRule()
//     const players = []
//     for ( let i = 1;i < 6;i++)
//     {
//       let player = new Player(i.toString(),100 * i)
//       players.push(player)
//     }
//     console.log(" players ",players)
//     const strack = new Stack()
//     strack.bb = 50
//     strack.sb = 25
//     strack.currency = "RMB"
//     const game = new Game(rule,players,strack,"4")
//     game.startGame()
//     game.getHoleCards()
//     console.log(" holecards  ",game.getHoleCards())
//     console.log(" boardcards  ",game.getBoardCardGroup())

//     game.Fold("2")
//     game.Call("3")
//     game.Fold("4")
//     game.Fold("5")
//     game.Call("1")
//     game.AllIn("3")
//     game.AllIn("1")
//     game.endGame()
//     console.log(" playerDic  ", game.getPlayerDataDic())
//     console.log(" getallactions   ", game.getAllActions())
//     console.log(" playerMoney   ", game.getPlayerMoneys())
//     expect(0).to.equal(0)

//   })