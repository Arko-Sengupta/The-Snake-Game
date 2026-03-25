import { BaseTick, LsKey } from '../Constants.js';

export const State = {
  GameState: 'start',
  Snake: [],
  Dir: { X: 1, Z: 0 },
  NextDir: { X: 1, Z: 0 },
  Food: { X: 0, Y: 0 },
  Score: 0,
  Best: parseInt(localStorage.getItem(LsKey) || '0', 10),
  Level: 1,
  FoodsEaten: 0,
  FoodsInLevel: 0,
  Combo: 1,
  LastEatMs: 0,
  TickMs: BaseTick,
  TickTimer: null,
  ShakeAmt: 0,
  ShakeDecay: 0,
  OrbitAng: 0,
  SnakeVis: null,
  FoodVis: null,
};
