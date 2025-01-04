// Import necessary libraries
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

// Three.js and Cannon.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 25, 10);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adds smooth motion to mouse controls
controls.dampingFactor = 0.1;
controls.minDistance = 5; // Minimum zoom distance
controls.maxDistance = 100; // Maximum zoom distance

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// Track material
const trackMaterial = new CANNON.Material("trackMaterial");

// Ball material
const ballMaterial = new CANNON.Material("ballMaterial");
const ballContactMaterial = new CANNON.ContactMaterial(
  trackMaterial,
  ballMaterial,
  {
    friction: 10,
    restitution: 0,
  }
);
world.addContactMaterial(ballContactMaterial);

// Ball setup
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterialThree = new THREE.MeshStandardMaterial({ color: 0xffffff });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterialThree);
scene.add(ballMesh);

const ballBody = new CANNON.Body({
  mass: 20,
  material: ballMaterial,
  shape: new CANNON.Sphere(0.5),
});
ballBody.position.set(0, 15, 0);
world.addBody(ballBody);

// Light setup
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Load track and debug slopes
const loader = new GLTFLoader();
const config = {
  trackModelPath: "../models/track.glb",
  trackPositions: {},
  trackRotations: {},
};

// Debugging Function: Add Normals Visualization
function addNormals(mesh, color = 0xff0000) {
  if (mesh.geometry.attributes.normal) {
    const wireframe = new THREE.WireframeGeometry(mesh.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.LineSegments(wireframe, lineMaterial);
    mesh.add(line);
  }
}

loader.load(config.trackModelPath || "../models/track.glb", (gltf) => {
  const track = gltf.scene;
  scene.add(track);

  track.traverse((child) => {
    if (child.isMesh) {
      const geometry = child.geometry.clone();
      geometry.applyMatrix4(child.matrixWorld);

      const vertices = Array.from(geometry.attributes.position.array);
      const indices = Array.from(geometry.index.array);

      const shape = new CANNON.Trimesh(vertices, indices);

      const body = new CANNON.Body({
        mass: 0,
        material: trackMaterial,
      });
      body.addShape(shape);

      const position = config.trackPositions?.[child.name] || {
        x: 0,
        y: 0,
        z: 0,
      };
      const rotation = config.trackRotations?.[child.name] || {
        x: 0,
        y: 0,
        z: 0,
      };
      body.position.set(position.x, position.y, position.z);
      body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);

      world.addBody(body);
      addNormals(child);

      const slopeAngle = Math.acos(
        new THREE.Vector3(0, 1, 0).dot(
          child.getWorldDirection(new THREE.Vector3())
        )
      );
      if (slopeAngle > Math.PI / 4) {
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true,
        });
        child.material = material;
      }
    }
  });
});

// WSAD Controls for Ball Movement
const keyState = {};
window.addEventListener("keydown", (event) => {
  keyState[event.code] = true;
});
window.addEventListener("keyup", (event) => {
  keyState[event.code] = false;
});

// Function to handle ball movement
function handleBallMovement() {
  const speed = 0.1;

  if (keyState["KeyW"]) ballBody.velocity.z -= speed;
  if (keyState["KeyS"]) ballBody.velocity.z += speed;
  if (keyState["KeyA"]) ballBody.velocity.x -= speed;
  if (keyState["KeyD"]) ballBody.velocity.x += speed;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  world.step(1 / 60);
  handleBallMovement();

  ballMesh.position.copy(ballBody.position);
  ballMesh.quaternion.copy(ballBody.quaternion);

  controls.update(); // Update OrbitControls
  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export default App;
