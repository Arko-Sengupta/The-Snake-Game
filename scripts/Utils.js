import * as THREE from 'three';
import { Half } from './Constants.js';

export const C2W = (Cx, Cz) => new THREE.Vector3(Cx - Half + 0.5, 0, Cz - Half + 0.5);

export const LerpHex = (A, B, T) => {
  const Ar = (A >> 16) & 0xff, Ag = (A >> 8) & 0xff, Ab = A & 0xff;
  const Br = (B >> 16) & 0xff, Bg = (B >> 8) & 0xff, Bb = B & 0xff;
  return (Math.round(Ar + (Br - Ar) * T) << 16) | (Math.round(Ag + (Bg - Ag) * T) << 8) | Math.round(Ab + (Bb - Ab) * T);
};