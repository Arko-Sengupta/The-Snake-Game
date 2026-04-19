import * as THREE from 'three';
import { Scene } from '../Scene/Renderer.js';
import { C2W } from '../Utils.js';
import { FoodLight } from '../Scene/Lighting.js';

export class FoodVisuals {
  constructor() {
    this.Grp = new THREE.Group();
    Scene.add(this.Grp);
    this.Orbs = [];
    this._Build();
  }

  _Build() {
    this.Core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.35, 1),
      new THREE.MeshStandardMaterial({
        color: 0xff44cc, emissive: 0xcc0088,
        emissiveIntensity: 0.2, metalness: 0.2, roughness: 0.2,
      })
    );
    this.Grp.add(this.Core);

    const OGeo = new THREE.SphereGeometry(0.072, 8, 8);
    for (let I = 0; I < 6; I++) {
      const M = new THREE.Mesh(OGeo,
        new THREE.MeshStandardMaterial({ color: 0xff66dd, emissive: 0xcc0099, emissiveIntensity: 0.2 }));
      this.Grp.add(M);
      this.Orbs.push({ Mesh: M, Phase: (I / 6) * Math.PI * 2, Tilt: (I % 3) * (Math.PI / 3) });
    }
  }

  Place(Cx, Cz) {
    const Wp = C2W(Cx, Cz);
    this.Grp.position.set(Wp.x, 0, Wp.z);
    FoodLight.position.set(Wp.x, 0.6, Wp.z);
  }

  Tick(T) {
    this.Core.rotation.x = T * 1.1;
    this.Core.rotation.y = T * 0.85;
    this.Core.rotation.z = T * 0.5;
    const Cy = 0.36 + Math.sin(T * 2.3) * 0.13;
    this.Core.position.y = Cy;

    this.Orbs.forEach(O => {
      const A = T * 1.85 + O.Phase;
      const R = 0.60;
      O.Mesh.position.set(
        Math.cos(A) * R,
        Cy + Math.sin(A * 0.75 + O.Tilt) * R * 0.42,
        Math.sin(A) * R
      );
    });
  }

  Destroy() {
    Scene.remove(this.Grp);
    this.Core.geometry.dispose(); this.Core.material.dispose();
    this.Orbs.forEach(O => { O.Mesh.geometry.dispose(); O.Mesh.material.dispose(); });
  }
}