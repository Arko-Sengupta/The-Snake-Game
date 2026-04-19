import * as THREE from 'three';

export const Camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
Camera.position.set(0, 28, 22);
Camera.lookAt(0, 0, 0);