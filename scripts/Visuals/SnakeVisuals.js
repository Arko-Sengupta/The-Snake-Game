import * as THREE from 'three';
import { Scene } from '../Scene/Renderer.js';
import { HeadCol, TailCol, HeadEmit } from '../Constants.js';
import { C2W, LerpHex } from '../Utils.js';

export class SnakeVisuals {
  constructor() {
    this.Group = new THREE.Group();
    Scene.add(this.Group);
    this.Meshes = [];
    this.Eyes = [];
  }

  Sync(Segments, Dir) {
    const N = Segments.length;

    while (this.Meshes.length < N) {
      const IsHead = this.Meshes.length === 0;
      const H = IsHead ? 0.55 : 0.45;
      const Geo = new THREE.BoxGeometry(0.85, H, 0.85);
      const Mat = new THREE.MeshStandardMaterial({
        color: HeadCol, emissive: HeadEmit,
        emissiveIntensity: 0.15, metalness: 0.3, roughness: 0.3,
      });
      const Mesh = new THREE.Mesh(Geo, Mat);
      Mesh.castShadow = true;
      Mesh.userData.H = H;
      this.Group.add(Mesh);
      this.Meshes.push(Mesh);
    }

    while (this.Meshes.length > N) {
      const M = this.Meshes.pop();
      this.Group.remove(M);
      M.geometry.dispose(); M.material.dispose();
    }

    for (let I = 0; I < N; I++) {
      const Seg = Segments[I];
      const Mesh = this.Meshes[I];
      const Wp = C2W(Seg.X, Seg.Y);
      Mesh.position.set(Wp.x, Mesh.userData.H / 2 + 0.02, Wp.z);
      Mesh.userData.BaseY = Mesh.userData.H / 2 + 0.02;
      Mesh.userData.Idx = I;
      Mesh.userData.Total = N;
      Mesh.material.transparent = false;
      Mesh.material.opacity = 1;
      delete Mesh.userData.Death;

      const T = N > 1 ? I / (N - 1) : 0;
      Mesh.material.color.setHex(LerpHex(HeadCol, TailCol, T));
      Mesh.material.emissive.setHex(LerpHex(HeadEmit, 0x004433, T));
      Mesh.material.emissiveIntensity = 0.15 - T * 0.1;
    }

    this._SyncEyes(Segments[0], Dir);
  }

  _SyncEyes(Head, Dir) {
    this.Eyes.forEach(E => { this.Group.remove(E); E.geometry.dispose(); E.material.dispose(); });
    this.Eyes = [];
    if (!this.Meshes.length) return;

    const EGeo = new THREE.SphereGeometry(0.072, 8, 8);
    const EMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 });
    const Wp = C2W(Head.X, Head.Y);
    const Fwd = { X: Dir.X * 0.3, Z: Dir.Z * 0.3 };
    const Offs = Dir.X !== 0
      ? [{ X: 0, Z: -0.23 }, { X: 0, Z: 0.23 }]
      : [{ X: -0.23, Z: 0 }, { X: 0.23, Z: 0 }];

    Offs.forEach(O => {
      const E = new THREE.Mesh(EGeo, EMat.clone());
      E.position.set(Wp.x + O.X + Fwd.X, 0.34, Wp.z + O.Z + Fwd.Z);
      this.Group.add(E);
      this.Eyes.push(E);
    });
  }

  TriggerDeath(Segments) {
    Segments.forEach((Seg, I) => {
      const M = this.Meshes[I];
      if (!M) return;
      M.userData.Death = { StartMs: performance.now() + I * 55 };
    });
  }

  Tick(Time) {
    this.Meshes.forEach(Mesh => {
      const D = Mesh.userData.Death;
      if (D) {
        const El = performance.now() - D.StartMs;
        if (El < 0) return;
        const T = Math.min(El / 750, 1);
        const By = Mesh.userData.H / 2 + 0.02;
        if (T < 0.4) {
          Mesh.position.y = By + Math.sin((T / 0.4) * Math.PI) * 2.0;
        } else {
          Mesh.position.y = By - ((T - 0.4) / 0.6) * (By + 0.3);
        }
        Mesh.material.transparent = true;
        Mesh.material.opacity = 1 - T;
      } else {
        const Phase = (Mesh.userData.Idx || 0) / Math.max(Mesh.userData.Total || 1, 1) * Math.PI * 2;
        Mesh.scale.y = 1 + Math.sin(Time * 2.6 + Phase) * 0.042;
        Mesh.position.y = Mesh.userData.BaseY || 0.3;
      }
    });
    this.Eyes.forEach(E => { E.position.y = 0.34 + Math.sin(Time * 2.6) * 0.022; });
  }

  Clear() {
    this.Meshes.forEach(M => { this.Group.remove(M); M.geometry.dispose(); M.material.dispose(); });
    this.Meshes = [];
    this.Eyes.forEach(E => { this.Group.remove(E); E.geometry.dispose(); E.material.dispose(); });
    this.Eyes = [];
  }
}