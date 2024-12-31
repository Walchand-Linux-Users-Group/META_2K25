// Import necessary libraries
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

// Import config (sceneData.json provided by you)
import config from "./sceneData.json"; // Import the sceneData.json file here

// Scene, Camera, and Renderer Setup
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

// Physics World Setup
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Cannon Debugger
const cannonDebugger = new CannonDebugger(scene, world);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Create Physics Materials
const ballMaterial = new CANNON.Material("ballMaterial");
const trackMaterial = new CANNON.Material("trackMaterial");

// Define Contact Material between ball and track
const contactMaterial = new CANNON.ContactMaterial(
  ballMaterial,
  trackMaterial,
  {
    friction: config.friction || 0.5, // Use JSON config for friction
    restitution: config.restitution || 0.001, // Use JSON config for restitution
  }
);
world.addContactMaterial(contactMaterial);

// Load Track Model
const loader = new GLTFLoader();
loader.load(config.trackModelPath || "../models/trac.glb", (gltf) => {
  const track = gltf.scene;
  scene.add(track);

  // Iterate over each mesh in the track model and create Trimesh
  track.traverse((child) => {
    if (child.isMesh) {
      const geometry = child.geometry.clone();

      // Apply world transformations to the geometry
      geometry.applyMatrix4(child.matrixWorld);

      // Extract vertices and indices
      const vertices = Array.from(geometry.attributes.position.array);
      const indices = Array.from(geometry.index.array);

      // Create a Trimesh shape
      const shape = new CANNON.Trimesh(vertices, indices);

      // Create a static body with mass 0
      const body = new CANNON.Body({
        mass: 0, // Static body (doesn't move)
        material: trackMaterial,
      });

      body.addShape(shape);

      // Manually set the position and rotation based on the JSON data
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

      // Set the position and rotation from the JSON config
      body.position.set(position.x, position.y, position.z);
      body.quaternion.setFromEuler(
        new THREE.Euler(rotation.x, rotation.y, rotation.z)
      );

      // Add body to the world
      world.addBody(body);

      // For debugging, visualize the Trimesh in the scene
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }
  });
  console.log("Track model processed:", track);
});

// Ball Setup from config.json
const ballRadius = config.ballRadius || 0.5;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const ballMaterialMesh = new THREE.MeshStandardMaterial({
  color: config.ballColor || 0xff0000,
});
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterialMesh);
scene.add(ballMesh);

const ballShape = new CANNON.Sphere(ballRadius);
const ballBody = new CANNON.Body({
  mass: config.ballMass || 5,
  material: ballMaterial, // Use ball material
});
ballBody.addShape(ballShape);
ballBody.position.set(
  config.ballStartPosition?.x || 0,
  config.ballStartPosition?.y || 10,
  config.ballStartPosition?.z || 0
);
world.addBody(ballBody);

// Camera Position from config
camera.position.set(
  config.cameraPosition?.x || 10,
  config.cameraPosition?.y || 20,
  config.cameraPosition?.z || 15
);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Keyboard Controls
const keys = { w: false, a: false, s: false, d: false };
window.addEventListener("keydown", (event) => {
  if (event.key in keys) keys[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  if (event.key in keys) keys[event.key] = false;
});

function updateBallControls() {
  const force = config.ballForce || 7;
  if (keys.w) {
    ballBody.applyForce(new CANNON.Vec3(0, 0, -force), ballBody.position);
  }
  if (keys.s) {
    ballBody.applyForce(new CANNON.Vec3(0, 0, force), ballBody.position);
  }
  if (keys.a) {
    ballBody.applyForce(new CANNON.Vec3(-force, 0, 0), ballBody.position);
  }
  if (keys.d) {
    ballBody.applyForce(new CANNON.Vec3(force, 0, 0), ballBody.position);
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update Physics World
  world.step(1 / 60);

  // Update Ball Controls
  updateBallControls();

  // Sync Ball Position
  ballMesh.position.copy(ballBody.position);
  ballMesh.quaternion.copy(ballBody.quaternion);

  // Update Cannon Debugger
  cannonDebugger.update();

  // Render the Scene
  renderer.render(scene, camera);
}

const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
  mass: 0, // Static body
});
groundBody.addShape(groundShape);
groundBody.position.set(0, -1, 0); // Position below the ball
world.addBody(groundBody);

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export default App;
