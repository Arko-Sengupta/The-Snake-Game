import * as THREE from 'three';
import { Scene } from '../Scene/Renderer.js';

export const LiveParticles = [];
const PGeo = new THREE.SphereGeometry(0.09, 6, 6);

export const Burst = (Wx, Wz) => {
  for (let I = 0; I < 30; I++) {
    const Mat = new THREE.MeshStandardMaterial({
      color: 0xff44cc, emissive: 0xcc0088, emissiveIntensity: 0.2,
      transparent: true, opacity: 1,
    });
    const M = new THREE.Mesh(PGeo, Mat);
    M.position.set(Wx, 0.3 + Math.random() * 0.4, Wz);
    const Ang = Math.random() * Math.PI * 2;
    const Spd = 0.038 + Math.random() * 0.09;
    M.userData = {
      Vx: Math.cos(Ang) * Spd,
      Vy: 0.042 + Math.random() * 0.075,
      Vz: Math.sin(Ang) * Spd,
      Born: performance.now(),
    };
    Scene.add(M);
    LiveParticles.push(M);
  }
};

export const TickParticles = () => {
  const Now = performance.now();
  for (let I = LiveParticles.length - 1; I >= 0; I--) {
    const P = LiveParticles[I];
    const Age = (Now - P.userData.Born) / 600;
    if (Age >= 1) {
      Scene.remove(P);
      P.material.dispose();
      LiveParticles.splice(I, 1);
      continue;
    }
    const D = P.userData;
    P.position.x += D.Vx; D.Vx *= 0.93;
    P.position.y += D.Vy; D.Vy *= 0.93;
    P.position.z += D.Vz; D.Vz *= 0.93;
    P.material.opacity = 1 - Age;
    P.scale.setScalar(1 - Age * 0.7);
  }
};