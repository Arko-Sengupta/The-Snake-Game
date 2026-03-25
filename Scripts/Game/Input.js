import { State } from './State.js';
import { TogglePause, HandleAction, TryDir } from './Logic.js';

export const InitInput = () => {
  document.addEventListener('keydown', (E) => {
    switch (E.code) {
      case 'ArrowUp':    case 'KeyW': TryDir(0, -1); break;
      case 'ArrowDown':  case 'KeyS': TryDir(0, 1); break;
      case 'ArrowLeft':  case 'KeyA': TryDir(-1, 0); break;
      case 'ArrowRight': case 'KeyD': TryDir(1, 0); break;
      case 'Space':
        E.preventDefault();
        if (State.GameState === 'playing') TogglePause();
        else HandleAction();
        break;
    }
  });
  document.addEventListener('click', HandleAction);
};
