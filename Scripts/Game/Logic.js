import { State } from './State.js';
import { Grid, BaseTick, MinTick, FoodsPerLevel, LsKey } from '../Constants.js';
import { C2W } from '../Utils.js';
import { SnakeVisuals } from '../Visuals/SnakeVisuals.js';
import { FoodVisuals } from '../Visuals/FoodVisuals.js';
import { Burst } from '../Visuals/Particles.js';
import { SndMove, SndEat, SndCombo, SndLevelUp, SndDeath } from '../Audio/Audio.js';
import { UpdateHud, ShowComboHud, ShowLevelUp } from '../Hud/Hud.js';

const FlashEl = document.getElementById('Flash');
const PauseScreenEl = document.getElementById('PauseScreen');
const GameoverScreenEl = document.getElementById('GameoverScreen');
const GoScoreValEl = document.getElementById('GoScoreVal');
const GoBestValEl = document.getElementById('GoBestVal');
const NewHighBadgeEl = document.getElementById('NewHighBadge');
const StartScreenEl = document.getElementById('StartScreen');

export const SpawnFood = () => {
  const Taken = new Set(State.Snake.map(S => `${S.X},${S.Y}`));
  const Free = [];
  for (let X = 0; X < Grid; X++)
    for (let Y = 0; Y < Grid; Y++)
      if (!Taken.has(`${X},${Y}`)) Free.push({ X, Y });
  if (!Free.length) return;
  State.Food = Free[Math.floor(Math.random() * Free.length)];
  State.FoodVis.Place(State.Food.X, State.Food.Y);
};

export const InitGame = () => {
  State.Score = 0;
  State.Level = 1;
  State.FoodsEaten = 0;
  State.FoodsInLevel = 0;
  State.Combo = 1;
  State.LastEatMs = 0;
  State.TickMs = BaseTick;
  State.ShakeAmt = 0;
  State.Dir = { X: 1, Z: 0 };
  State.NextDir = { X: 1, Z: 0 };

  State.Snake = [
    { X: 12, Y: 10 },
    { X: 11, Y: 10 },
    { X: 10, Y: 10 },
  ];

  if (State.SnakeVis) State.SnakeVis.Clear();
  State.SnakeVis = new SnakeVisuals();
  State.SnakeVis.Sync(State.Snake, State.Dir);

  if (State.FoodVis) State.FoodVis.Destroy();
  State.FoodVis = new FoodVisuals();
  SpawnFood();

  UpdateHud(State.Score, State.Best, State.Level, State.FoodsInLevel, FoodsPerLevel);
  clearInterval(State.TickTimer);
  State.TickTimer = setInterval(GameTick, State.TickMs);
};

export const GameTick = () => {
  if (State.GameState !== 'playing') return;
  State.Dir = { ...State.NextDir };

  const Head = State.Snake[0];
  const Nx = Head.X + State.Dir.X;
  const Nz = Head.Y + State.Dir.Z;

  if (Nx < 0 || Nx >= Grid || Nz < 0 || Nz >= Grid) { Die(); return; }
  if (State.Snake.some(S => S.X === Nx && S.Y === Nz)) { Die(); return; }

  State.Snake.unshift({ X: Nx, Y: Nz });

  if (Nx === State.Food.X && Nz === State.Food.Y) {
    Eat();
  } else {
    State.Snake.pop();
  }

  State.SnakeVis.Sync(State.Snake, State.Dir);
  SndMove();
};

export const Eat = () => {
  State.FoodsEaten++;
  State.FoodsInLevel++;

  const Now = performance.now();
  if (State.LastEatMs !== 0 && Now - State.LastEatMs < 3000) {
    State.Combo = Math.min(State.Combo + 1, 8);
    SndCombo(State.Combo);
  } else {
    State.Combo = 1;
    SndEat();
  }
  State.LastEatMs = Now;

  const Pts = 10 * State.Combo * State.Level;
  State.Score += Pts;
  if (State.Score > State.Best) {
    State.Best = State.Score;
    try {
      localStorage.setItem(LsKey, State.Best);
    } catch (E) {}
  }

  const Wp = C2W(State.Food.X, State.Food.Y);
  Burst(Wp.x, Wp.z);

  if (State.FoodsInLevel >= FoodsPerLevel) {
    State.FoodsInLevel = 0;
    State.Level++;
    State.TickMs = Math.max(MinTick, BaseTick - (State.Level - 1) * 10);
    clearInterval(State.TickTimer);
    State.TickTimer = setInterval(GameTick, State.TickMs);
    SndLevelUp();
    ShowLevelUp();
  }

  ShowComboHud(State.Combo);
  SpawnFood();
  UpdateHud(State.Score, State.Best, State.Level, State.FoodsInLevel, FoodsPerLevel);
};

export const Die = () => {
  State.GameState = 'dead';
  clearInterval(State.TickTimer);
  SndDeath();

  FlashEl.style.background = '#ff000066';
  setTimeout(() => { FlashEl.style.background = 'transparent'; }, 220);

  State.ShakeAmt = 0.65;
  State.ShakeDecay = 0.91;

  State.SnakeVis.TriggerDeath(State.Snake);

  setTimeout(() => {
    GoScoreValEl.textContent = State.Score;
    GoBestValEl.textContent = State.Best;
    NewHighBadgeEl.style.display = (State.Score > 0 && State.Score >= State.Best) ? 'block' : 'none';
    GameoverScreenEl.style.display = 'flex';
  }, 1300);
};

export const TogglePause = () => {
  if (State.GameState === 'playing') {
    State.GameState = 'paused';
    clearInterval(State.TickTimer);
    PauseScreenEl.style.display = 'flex';
  } else if (State.GameState === 'paused') {
    State.GameState = 'playing';
    PauseScreenEl.style.display = 'none';
    State.TickTimer = setInterval(GameTick, State.TickMs);
  }
};

export const HandleAction = () => {
  if (State.GameState === 'start') {
    StartScreenEl.style.display = 'none';
    State.GameState = 'playing';
    InitGame();
  } else if (State.GameState === 'paused') {
    TogglePause();
  } else if (State.GameState === 'dead') {
    GameoverScreenEl.style.display = 'none';
    if (State.SnakeVis) State.SnakeVis.Clear();
    State.GameState = 'playing';
    InitGame();
  }
};

export const TryDir = (Dx, Dz) => {
  if (State.GameState !== 'playing') return;
  if (Dx !== 0 && State.Dir.X !== 0) return;
  if (Dz !== 0 && State.Dir.Z !== 0) return;
  State.NextDir = { X: Dx, Z: Dz };
};
