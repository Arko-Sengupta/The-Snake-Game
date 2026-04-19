import * as THREE from 'three';
import { Scene } from '../Scene/Renderer.js';
import { C2W } from '../Utils.js';

export const BonusLight = new THREE.PointLight(0xffcc00, 2.0, 6);

export class BonusFoodVisuals {
  constructor() {
    this.Grp = new THREE.Group();
    Scene.add(this.Grp);
    this.Orbs = [];
    this._Build();
  }

  _Build() {
    this.Core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.38, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        emissive: 0xcc8800,
        emissiveIntensity: 0.3,
        metalness: 0.6,
        roughness: 0.15,
      })
    );
    this.Grp.add(this.Core);

    const OGeo = new THREE.SphereGeometry(0.065, 8, 8);
    const Colors = [0xffcc00, 0xff8800, 0xffee44, 0xff6600];
    for (let I = 0; I < 4; I++) {
      const M = new THREE.Mesh(OGeo,
        new THREE.MeshStandardMaterial({ color: Colors[I], emissive: Colors[I], emissiveIntensity: 0.25 }));
      this.Grp.add(M);
      this.Orbs.push({ Mesh: M, Phase: (I / 4) * Math.PI * 2 });
    }

    const RingGeo = new THREE.TorusGeometry(0.58, 0.025, 8, 48);
    this.Ring = new THREE.Mesh(RingGeo,
      new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.4, transparent: true, opacity: 0.7 }));
    this.Ring.rotation.x = Math.PI / 2;
    this.Grp.add(this.Ring);
  }

  Place(Cx, Cz) {
    const Wp = C2W(Cx, Cz);
    this.Grp.position.set(Wp.x, 0, Wp.z);
    BonusLight.position.set(Wp.x, 0.8, Wp.z);
  }

  Tick(T) {
    this.Core.rotation.x = T * 2.2;
    this.Core.rotation.y = T * 1.7;
    this.Core.rotation.z = T * 1.1;
    const Pulse = 1 + Math.sin(T * 6) * 0.12;
    this.Core.scale.setScalar(Pulse);
    const Cy = 0.42 + Math.sin(T * 3.5) * 0.1;
    this.Core.position.y = Cy;

    this.Ring.rotation.z = T * 1.4;
    this.Ring.position.y = Cy;
    this.Ring.material.opacity = 0.5 + Math.sin(T * 5) * 0.2;

    this.Orbs.forEach((O) => {
      const A = T * 2.8 + O.Phase;
      const R = 0.55;
      O.Mesh.position.set(Math.cos(A) * R, Cy + Math.sin(A * 1.3) * 0.2, Math.sin(A) * R);
    });
  }

  Destroy() {
    Scene.remove(this.Grp);
    this.Core.geometry.dispose();
    this.Core.material.dispose();
    this.Orbs.forEach(O => { O.Mesh.geometry.dispose(); O.Mesh.material.dispose(); });
    this.Ring.geometry.dispose();
    this.Ring.material.dispose();
  }
}