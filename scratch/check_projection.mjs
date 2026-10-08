import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(45, 1440 / 900, 0.1, 100);
camera.position.set(0.35, 1.05, 4.60);
camera.lookAt(-0.30, -0.35, 0.10);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

const points = [
  { name: 'u=0.0', pos: new THREE.Vector3(-2.40, 0.55, -0.85) },
  { name: 'u=0.3', pos: new THREE.Vector3(-1.31, -0.17, -0.03) },
  { name: 'u=0.5', pos: new THREE.Vector3(-0.38, -0.84, 0.47) },
  { name: 'u=0.7', pos: new THREE.Vector3(0.28, -0.82, 0.31) },
  { name: 'u=0.85', pos: new THREE.Vector3(1.0, -0.85, 0.82) },
  { name: 'u=1.0', pos: new THREE.Vector3(1.50, -0.80, 0.84) },
];

points.forEach(pt => {
  const v = pt.pos.clone().project(camera);
  const screenX = (v.x * 0.5 + 0.5) * 1440;
  const screenY = (-(v.y * 0.5) + 0.5) * 900;
  console.log(pt.name, 'world:', pt.pos, 'screen:', { screenX: screenX.toFixed(1), screenY: screenY.toFixed(1), ndcZ: v.z.toFixed(2) });
});
