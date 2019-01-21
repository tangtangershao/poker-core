/**
 * Tests for Card class
 */
import { Card, Rank, Suit } from '../src/index'
import Game, { CanNotActionAtStreetError, NotPlayerTurnToActionError,
  PlayerNotHaveEnoughMoneyError, GameIsNotStartError } from '../src/Game'
import { IRule, FullDeckRule } from '../src/Rule'
import { Stack } from '../src/Define'
import Player from '../src/Player'
import { GameIsEndError, GameIsStartedError } from '../src/Game';

//#region getNestPlayer()

test('getNestPlayer()  GameIsNotStartError ', () => {
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
  expect(() => { game.getNextPlayer() }).toThrow(GameIsNotStartError)
})

test('getNestPlayer() GameIsEndError ', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => { game.getNextPlayer() }).toThrow(GameIsEndError)
})

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
  expect(game.getNextPlayer().id).toEqual("2")
})

//#endregion

//#region Bet()

test('bet() GameIsNotStartError', () => {
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
  expect(() => {game.Bet("2",100)}).toThrow(GameIsNotStartError)
})

test('bet() NotPlayerTurnToActionError', () => {
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
  expect(() => {game.Bet("3",100)}).toThrow(NotPlayerTurnToActionError)
})

test('bet() CanNotActionAtStreetError', () => {
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
  game.Fold("2")
  expect(() => {game.Bet("3",100)}).toThrow(CanNotActionAtStreetError)
})

test('bet() PlayerNotHaveEnoughMoneyError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  expect(() => {game.Bet("3",700)}).toThrow(PlayerNotHaveEnoughMoneyError)
})

test('bet() GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.Bet("2",100)}).toThrow(GameIsEndError)
})

//#endregion

//#region Raise()

test('Raise()  GameIsNotStartError', () => {
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
  expect(() => {game.Raise("2",100)}).toThrow(GameIsNotStartError)
  game.startGame()
})

test('Raise()  NotPlayerTurnToActionError', () => {
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
  expect(() => {game.Raise("3",300)}).toThrow(NotPlayerTurnToActionError)
})

test('Raise()  CanNotActionAtStreetError', () => {
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
  game.Call("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.Check("2")
  expect(() => {game.Raise("3",50)}).toThrow(CanNotActionAtStreetError)
})

test('Raise()  PlayerNotHaveEnoughMoneyError', ()  =>  {
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
  expect(() => {game.Raise("2",300)}).toThrow(PlayerNotHaveEnoughMoneyError)
})

test('Raise()  GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.Raise("2",300)}).toThrow(GameIsEndError)
})

//#endregion

//#region Check()

test('Check()  GameIsNotStartError', () => {
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
  expect(() => {game.Check("2")}).toThrow(GameIsNotStartError)
  game.startGame()
})

test('Check()  NotPlayerTurnToActionError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  expect(() => { game.Check("3")}).toThrow(NotPlayerTurnToActionError)
})

test('Check()  CanNotActionAtStreetError', () => {
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
  game.Call("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.Bet("2",100)
  expect(() => {game.Check("3")}).toThrow(CanNotActionAtStreetError)
})

test('Check()  GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.Check("3")}).toThrow(GameIsEndError)
})

//#endregion

//#region Fold()

test('Fold()  GameIsNotStartError', () => {
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
  expect(() => {game.Fold("2")}).toThrow(GameIsNotStartError)
  game.startGame()
})

test('Fold()  NotPlayerTurnToActionError', () => {
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
  game.Fold("2")
  game.Call("3")
  expect(() => { game.Fold("5")}).toThrow(NotPlayerTurnToActionError)
})

test('Fold()  GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.Fold("3")}).toThrow(GameIsEndError)
})

//#endregion

//#region Call()

test('Call()  GameIsNotStartError', () => {
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
  expect(() => {game.Call("2")}).toThrow(GameIsNotStartError)
  game.startGame()
})

test('Call()  NotPlayerTurnToActionError', () => {
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
  game.Fold("2")
  game.Call("3")
  expect(() => { game.Call("5")}).toThrow(NotPlayerTurnToActionError)
})

test('Call()  CanNotActionAtStreetError', () => {
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
  game.Call("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  expect(() => {game.Call("2")}).toThrow(CanNotActionAtStreetError)
})

test('Call()  PlayerNotHaveEnoughMoneyError', () => {
  const rule = new FullDeckRule()
  const players = []
  for ( let i = 1;i < 6;i++)
  {
    let player = new Player(i.toString(),100 * (6 - i))
    players.push(player)
  }
  const strack = new Stack()
  strack.bb = 50
  strack.sb = 25
  strack.currency = "RMB"
  const game = new Game(rule,players,strack,"4")
  game.startGame()
  game.Raise("2",350)
  expect(() => {game.Call("3")}).toThrow(PlayerNotHaveEnoughMoneyError)
})

test('Call()  GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.Call("3")}).toThrow(GameIsEndError)
})

//#endregion

//#region AllIn()

test('AllIn()  GameIsNotStartError', () => {
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
  expect(() => {game.AllIn("2")}).toThrow(GameIsNotStartError)
  game.startGame()
})

test('AllIn()  NotPlayerTurnToActionError', () => {
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
  game.Fold("2")
  game.Call("3")
  expect(() => { game.AllIn("5")}).toThrow(NotPlayerTurnToActionError)
})

test('AllIn()  GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.Call("3")}).toThrow(GameIsEndError)
})

//#endregion

//#region getHoleCards()

test('getHoleCards()  GameIsNotStartError', () => {
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
  expect(() => {game.getHoleCards()}).toThrow(GameIsNotStartError)
})

//#endregion

//#region  startGame()

test('startGame()  GameIsStartedError', () => {
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
  expect(() => {game.startGame()}).toThrow(GameIsStartedError)
})

test('startGame()  GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.startGame()}).toThrow(GameIsEndError)
})

//#endregion

//#region   endGame()

test('endGame()  GameIsNotStartError', () => {
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
  expect(() => {game.endGame()}).toThrow(GameIsNotStartError)
})

test('endGame()  GameIsEndError', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(() => {game.endGame()}).toThrow(GameIsEndError)
})

//#endregion

//#region getPodsAmount()

test('getPodsAmount()  GameIsNotStartError ', () => {
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
  expect(() => {game.getPodsAmount()}).toThrow(GameIsNotStartError)
})

test('getPodsAmount()  ', () => {
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
  game.Fold("2")
  game.Call("3")
  game.Fold("4")
  game.Fold("5")
  game.Check("1")
  game.AllIn("3")
  game.AllIn("1")
  game.endGame()
  expect(game.getPodsAmount()).toEqual([75,150,200])
})

//#endregion