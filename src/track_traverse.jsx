// Import necessary libraries
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

// Import config (assuming it's in the same directory, adjust the path accordingly)
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
world.gravity.set(0, -9.82, 0); // Ensure gravity is applied correctly

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

// Adjust Contact Material for Ball and Track
const contactMaterial = new CANNON.ContactMaterial(
  ballMaterial,
  trackMaterial,
  {
    friction: 1.0, // Increase friction to make the ball stop
    restitution: 0.1, // Low restitution so the ball doesn't bounce too much
  }
);
world.addContactMaterial(contactMaterial);

// Load Track
const loader = new GLTFLoader();
loader.load(config.trackModelPath || "../models/track.glb", (gltf) => {
  const track = gltf.scene;
  scene.add(track);

  // Iterate over each mesh in the track model
  track.traverse((child) => {
    if (child.isMesh) {
      // Clone geometry to avoid modifying the original
      const geometry = child.geometry.clone();

      // Apply world transformations to the geometry
      geometry.applyMatrix4(child.matrixWorld);

      // Extract vertices and indices
      const vertices = Array.from(geometry.attributes.position.array);
      const indices = Array.from(geometry.index.array);

      // Create a Trimesh shape
      const shape = new CANNON.Trimesh(vertices, indices);

      // Create a static body with mass 0 (static body)
      const body = new CANNON.Body({
        mass: 0, // Static body (doesn't move)
        material: trackMaterial,
      });

      body.addShape(shape);

      // Manually set the position from config.json
      const position = new THREE.Vector3(
        config.trackPositions?.[child.name]?.x || 0,
        config.trackPositions?.[child.name]?.y || 0,
        config.trackPositions?.[child.name]?.z || 0
      );

      // Set the position and rotation from the mesh
      body.position.set(position.x, position.y, position.z);
      body.quaternion.set(
        child.rotation.x,
        child.rotation.y,
        child.rotation.z,
        child.rotation.w
      );

      // Add body to the world
      world.addBody(body);
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
  linearDamping: 0.9, // Apply damping to slow down the ball's linear motion
  angularDamping: 0.9, // Damping the ball's rotational motion
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

// Update Ball Controls
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

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
