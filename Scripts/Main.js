import * as THREE from 'three';
import { Renderer, Scene, Composer } from './Scene/Renderer.js';
import { Camera } from './Scene/Camera.js';
import { InitLighting, HeadLight } from './Scene/Lighting.js';
import { InitBoard } from './Scene/Board.js';
import { TickParticles } from './Visuals/Particles.js';
import { State } from './Game/State.js';
import { InitInput } from './Game/Input.js';
import { C2W } from './Utils.js';

const Clock = new THREE.Clock();

InitLighting();
InitBoard();
InitInput();

document.getElementById('BestVal').textContent = State.Best;

const Animate = () => {
  requestAnimationFrame(Animate);
  const T = Clock.getElapsedTime();

  if (State.GameState === 'start') {
    State.OrbitAng += 0.0028;
    Camera.position.set(
      Math.sin(State.OrbitAng) * 26,
      22 + Math.sin(State.OrbitAng * 0.4) * 3,
      Math.cos(State.OrbitAng) * 26
    );
    Camera.lookAt(0, 0, 0);
  } else {
    let Cx = 0, Cy = 28, Cz = 22;
    if (State.ShakeAmt > 0.008) {
      Cx += (Math.random() - 0.5) * State.ShakeAmt;
      Cy += (Math.random() - 0.5) * State.ShakeAmt;
      Cz += (Math.random() - 0.5) * State.ShakeAmt;
      State.ShakeAmt *= State.ShakeDecay;
    } else {
      State.ShakeAmt = 0;
    }
    Camera.position.set(Cx, Cy, Cz);
    Camera.lookAt(0, 0, 0);
  }

  if (State.SnakeVis) State.SnakeVis.Tick(T);

  if (State.Snake.length > 0) {
    const Hw = C2W(State.Snake[0].X, State.Snake[0].Y);
    HeadLight.position.set(Hw.x, 0.55, Hw.z);
  }

  if (State.FoodVis) State.FoodVis.Tick(T);
  if (State.BonusFoodVis) State.BonusFoodVis.Tick(T);

  TickParticles();
  Composer.render();
};

Animate();
