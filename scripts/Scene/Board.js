import * as THREE from 'three';
import { Scene } from './Renderer.js';
import { Grid, Half } from '../Constants.js';

export const InitBoard = () => {
  const Plane = new THREE.Mesh(
    new THREE.PlaneGeometry(Grid, Grid),
    new THREE.MeshStandardMaterial({ color: 0x0a0a1a, metalness: 0.45, roughness: 0.55 })
  );
  Plane.rotation.x = -Math.PI / 2;
  Plane.receiveShadow = true;
  Scene.add(Plane);

  const Pts = [];
  for (let I = 0; I <= Grid; I++) {
    const V = I - Half;
    Pts.push(V, 0.012, -Half, V, 0.012, Half);
    Pts.push(-Half, 0.012, V, Half, 0.012, V);
  }
  const LineGeo = new THREE.BufferGeometry();
  LineGeo.setAttribute('position', new THREE.Float32BufferAttribute(Pts, 3));
  Scene.add(new THREE.LineSegments(LineGeo,
    new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.13 })));

  const Bv = [-Half, 0.035, -Half, Half, 0.035, -Half, Half, 0.035, Half, -Half, 0.035, Half, -Half, 0.035, -Half];
  const BGeo = new THREE.BufferGeometry();
  BGeo.setAttribute('position', new THREE.Float32BufferAttribute(Bv, 3));
  Scene.add(new THREE.Line(BGeo,
    new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 })));

  const Verts = [];
  for (let I = 0; I < 200; I++) {
    const A = Math.random() * Math.PI * 2;
    const R = 38 + Math.random() * 55;
    Verts.push(Math.cos(A) * R, (Math.random() - 0.5) * 45, Math.sin(A) * R);
  }
  const StarGeo = new THREE.BufferGeometry();
  StarGeo.setAttribute('position', new THREE.Float32BufferAttribute(Verts, 3));
  Scene.add(new THREE.Points(StarGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true, transparent: true, opacity: 0.8 })));
};