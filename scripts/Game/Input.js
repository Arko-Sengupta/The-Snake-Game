import { State } from './State.js';
import { TogglePause, HandleAction, TryDir } from './Logic.js';

const SwipeThreshold = 30;
const TapThreshold = 20;

let TouchStartX = 0;
let TouchStartY = 0;

const OnTouchStart = (E) => {
  try {
    const Touch = E.changedTouches[0];
    TouchStartX = Touch.clientX;
    TouchStartY = Touch.clientY;
  } catch (Err) { }
};

const OnTouchEnd = (E) => {
  try {
    E.preventDefault();
    const Touch = E.changedTouches[0];
    const Dx = Touch.clientX - TouchStartX;
    const Dy = Touch.clientY - TouchStartY;
    const AbsDx = Math.abs(Dx);
    const AbsDy = Math.abs(Dy);
    const Dist = Math.sqrt(Dx * Dx + Dy * Dy);

    if (Dist < TapThreshold) {
      if (State.GameState !== 'playing') HandleAction();
      return;
    }

    if (State.GameState !== 'playing') {
      HandleAction();
      return;
    }

    if (Dist >= SwipeThreshold) {
      AbsDx > AbsDy ? TryDir(Dx > 0 ? 1 : -1, 0) : TryDir(0, Dy > 0 ? 1 : -1);
    }
  } catch (Err) { }
};

export const InitInput = () => {
  document.addEventListener('keydown', (E) => {
    switch (E.code) {
      case 'ArrowUp': case 'KeyW': TryDir(0, -1); break;
      case 'ArrowDown': case 'KeyS': TryDir(0, 1); break;
      case 'ArrowLeft': case 'KeyA': TryDir(-1, 0); break;
      case 'ArrowRight': case 'KeyD': TryDir(1, 0); break;
      case 'Space':
        E.preventDefault();
        if (State.GameState === 'playing') TogglePause();
        else HandleAction();
        break;
    }
  });

  document.addEventListener('click', HandleAction);
  document.addEventListener('touchstart', OnTouchStart, { passive: true });
  document.addEventListener('touchend', OnTouchEnd, { passive: false });

  const PauseBtn = document.getElementById('MobilePauseBtn');
  if (PauseBtn) {
    PauseBtn.addEventListener('touchend', (E) => {
      try {
        E.preventDefault();
        E.stopPropagation();
        if (State.GameState === 'playing' || State.GameState === 'paused') TogglePause();
      } catch (Err) { }
    });
    PauseBtn.addEventListener('click', (E) => {
      try {
        E.stopPropagation();
        if (State.GameState === 'playing' || State.GameState === 'paused') TogglePause();
      } catch (Err) { }
    });
  }
};