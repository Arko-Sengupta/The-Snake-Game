import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Camera } from './Camera.js';

export const Scene = new THREE.Scene();
Scene.background = new THREE.Color(0x050510);
Scene.fog = new THREE.Fog(0x050520, 32, 85);

export const Renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('GameCanvas'),
  antialias: true,
});
Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.shadowMap.enabled = true;
Renderer.shadowMap.type = THREE.PCFSoftShadowMap;
Renderer.toneMapping = THREE.ACESFilmicToneMapping;
Renderer.toneMappingExposure = 1.2;

export const Composer = new EffectComposer(Renderer);
Composer.addPass(new RenderPass(Scene, Camera));
Composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.25, 0.3, 0.8
));
Composer.addPass(new OutputPass());

window.addEventListener('resize', () => {
  Camera.aspect = window.innerWidth / window.innerHeight;
  Camera.updateProjectionMatrix();
  Renderer.setSize(window.innerWidth, window.innerHeight);
  Composer.setSize(window.innerWidth, window.innerHeight);
});