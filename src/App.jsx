// Import necessary libraries
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

// Import config (sceneData.json provided by you)
import config from "./sceneData.json";

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
    friction: config.friction || 0.5, // Reduced friction for better control
    restitution: config.restitution || 0, // Slight bounce reduction
  }
);
world.addContactMaterial(contactMaterial);

// Load Track Model and Generate Trimesh
const loader = new GLTFLoader();
loader.load(config.trackModelPath || "../models/track.glb", (gltf) => {
  const track = gltf.scene;
  scene.add(track);

  // Process each mesh in the track
  track.traverse((child) => {
    if (child.isMesh) {
      const geometry = child.geometry.clone();

      // Apply world transformations
      geometry.applyMatrix4(child.matrixWorld);

      // Extract vertices and indices
      const vertices = Array.from(geometry.attributes.position.array);
      const indices = Array.from(geometry.index.array);

      // Create a Trimesh shape
      const shape = new CANNON.Trimesh(vertices, indices);

      // Create a static body for the Trimesh
      const body = new CANNON.Body({
        mass: 0,
        material: trackMaterial,
      });
      body.addShape(shape);

      // Set position and rotation from JSON config
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

      // Add body to the physics world
      world.addBody(body);

      // Add debugging wireframe
      addWireframe(body);
    }
  });
});

// Function to Add Green Wireframe for Debugging
function addWireframe(body) {
  body.shapes.forEach((shape) => {
    if (shape instanceof CANNON.Trimesh) {
      const vertices = shape.vertices;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(vertices), 3)
      );

      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      const wireframe = new THREE.LineSegments(edges, material);

      wireframe.position.copy(body.position);
      scene.add(wireframe);
    }
  });
}

// Ball Setup from Config
const ballRadius = config.ballRadius || 0.5;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const ballMaterialMesh = new THREE.MeshStandardMaterial({
  color: config.ballColor || 0xff0000,
});
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterialMesh);
scene.add(ballMesh);

const ballShape = new CANNON.Sphere(ballRadius);
const ballBody = new CANNON.Body({
  mass: config.ballMass || 20,
  material: ballMaterial,
});
ballBody.addShape(ballShape);
ballBody.position.set(
  config.ballStartPosition?.x || 0,
  config.ballStartPosition?.y || 10,
  config.ballStartPosition?.z || 0
);
world.addBody(ballBody);

// Camera Position from Config
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
  const force = config.ballForce || 20; // Adjusted for smoother movement
  const forwardVector = new CANNON.Vec3(0, 0, -force);
  const backwardVector = new CANNON.Vec3(0, 0, force);
  const leftVector = new CANNON.Vec3(-force, 0, 0);
  const rightVector = new CANNON.Vec3(force, 0, 0);

  if (keys.w) {
    ballBody.applyForce(forwardVector, ballBody.position);
  }
  if (keys.s) {
    ballBody.applyForce(backwardVector, ballBody.position);
  }
  if (keys.a) {
    ballBody.applyForce(leftVector, ballBody.position);
  }
  if (keys.d) {
    ballBody.applyForce(rightVector, ballBody.position);
  }
}

function handleSlopes() {
  world.addEventListener("postStep", () => {
    world.contacts.forEach((contact) => {
      if (
        (contact.bi === ballBody && contact.bj.material === trackMaterial) ||
        (contact.bj === ballBody && contact.bi.material === trackMaterial)
      ) {
        const normal = contact.ni;
        const slopeThreshold = Math.cos((45 * Math.PI) / 180); // 45 degrees

        // Check if slope exceeds threshold
        if (normal.dot(new CANNON.Vec3(0, 1, 0)) < slopeThreshold) {
          ballBody.velocity.x *= 0.98; // Damp lateral movement
          ballBody.velocity.z *= 0.98; // Damp forward/backward movement
        }
      }
    });
  });
}

// Initialize slope handling
handleSlopes();

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

  // Render Scene
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
