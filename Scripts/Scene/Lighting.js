import * as THREE from 'three';
import { Scene } from './Renderer.js';

export const HeadLight = new THREE.PointLight(0x00ffcc, 1.0, 6);
export const FoodLight = new THREE.PointLight(0xff44cc, 1.5, 5);

export const InitLighting = () => {
  Scene.add(new THREE.AmbientLight(0x223344, 2.2));

  const DirLight = new THREE.DirectionalLight(0x88aaff, 1.4);
  DirLight.position.set(10, 20, 10);
  DirLight.castShadow = true;
  DirLight.shadow.mapSize.set(1024, 1024);
  Scene.add(DirLight);

  Scene.add(HeadLight);
  Scene.add(FoodLight);
};
