// Import necessary libraries
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

// Button to log ball coordinates
const logCoordsButton = document.getElementById("logBallCoords");

// Function to log the ball's current coordinates
function logBallCoordinates() {
  const ballPosition = ballBody.position;
  console.log(
    `Ball Coordinates: X: ${ballPosition.x.toFixed(
      2
    )}, Y: ${ballPosition.y.toFixed(2)}, Z: ${ballPosition.z.toFixed(2)}`
  );
}

// Add an event listener to the button
logCoordsButton.addEventListener("click", logBallCoordinates);

// Three.js and Cannon.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(16, 22, -26);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adds smooth motion to mouse controls
controls.dampingFactor = 0.1;
controls.minDistance = 5; // Minimum zoom distance
controls.maxDistance = 100; // Maximum zoom distance
controls.enableRotate = true; // Enable camera rotation
controls.enablePan = true; // Allow panning
controls.enableZoom = true; // Enable zoom

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
    restitution: 0.3,
  }
);
world.addContactMaterial(ballContactMaterial);

// Ball setup
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterialThree = new THREE.MeshStandardMaterial({ color: 0x0077ff }); // White color
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
const light = new THREE.DirectionalLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Adding a global light (ambient light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Load track and debug slopes
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Load the texture for the model (image stored in the public folder)
const texture = textureLoader.load("/space.jpg"); // Path to your texture file in the public folder

const config = {
  trackModelPath: "/models/untitled.glb",
  trackPositions: {},
  trackRotations: {},
};

// List of respawn points
const respawnPoints = [
  { x: 0.0, y: 6.95, z: 0.0 },
  { x: -20.81, y: 6.95, z: -0.07 },
  { x: -21.32, y: 6.95, z: -10.58 },
  { x: -42.31, y: 9.71, z: -10.5 },
  { x: -55.24, y: 6.95, z: -11.3 },
  { x: -63.95, y: 6.95, z: -6.64 },
  { x: -63.86, y: 6.95, z: 2.24 },
  { x: -63.67, y: 6.95, z: 12.65 },
  { x: -63.96, y: 6.95, z: 22.17 },
  { x: -63.52, y: 8.75, z: 38.78 },
  { x: -53.33, y: 4.47, z: 38.07 },
  { x: -42.2, y: 5.76, z: 34.64 },
  { x: -25.31, y: 5.27, z: 36.54 },
];

// Function to calculate the distance between two points
function calculateDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
      Math.pow(p2.y - p1.y, 2) +
      Math.pow(p2.z - p1.z, 2)
  );
}

// Function to find the nearest respawn point to the ball's current position
function findNearestRespawnPoint(ballPosition) {
  let closestPoint = respawnPoints[0];
  let minDistance = calculateDistance(ballPosition, closestPoint);

  // Loop through all respawn points to find the nearest one
  for (let i = 1; i < respawnPoints.length; i++) {
    const distance = calculateDistance(ballPosition, respawnPoints[i]);
    if (distance < minDistance) {
      closestPoint = respawnPoints[i];
      minDistance = distance;
    }
  }
  return closestPoint;
}

// Function to check if the ball has fallen off the map (e.g., y < -10)
function checkBallFallOff() {
  const ballPosition = ballBody.position;

  // If the ball falls off the map (below a certain Y position)
  if (ballPosition.y < -1) {
    // Find the nearest respawn point
    const nearestRespawn = findNearestRespawnPoint(ballPosition);

    // Reset the ball's position to the nearest respawn point
    ballBody.position.set(
      nearestRespawn.x,
      nearestRespawn.y + 2,
      nearestRespawn.z
    );
    ballBody.velocity.set(0, 0, 0); // Reset velocity to zero
    ballBody.angularVelocity.set(0, 0, 0); // Reset angular velocity to zero

    // Clear keyState to avoid residual movement
    keyState = {};

    // Ensure the ball mesh also reflects the updated position
    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);
  }
}

// Debugging Function: Add Normals Visualization
function addNormals(mesh) {
  const vertices = mesh.geometry.attributes.position.array;
  const normals = mesh.geometry.attributes.normal.array;
  const lines = [];

  for (let i = 0; i < vertices.length; i += 3) {
    const start = new THREE.Vector3(
      vertices[i],
      vertices[i + 1],
      vertices[i + 2]
    );
    const direction = new THREE.Vector3(
      normals[i],
      normals[i + 1],
      normals[i + 2]
    );

    const end = new THREE.Vector3().addVectors(
      start,
      direction.clone().multiplyScalar(0.1)
    ); // Scale normal length
    lines.push(start, end);
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(lines);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000, // Black or any color (doesn't matter if rendering is disabled)
    visible: false, // Disable visibility entirely
  });

  const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);

  // Ensure it's not rendered
  lineSegments.visible = false;

  mesh.add(lineSegments);
}

loader.load(config.trackModelPath || "/models/untitled.glb", (gltf) => {
  const track = gltf.scene;
  scene.add(track);

  track.traverse((child) => {
    if (child.isMesh) {
      // Ensure the original material and texture are preserved
      if (child.material && child.material.map) {
        // Retain the original texture
        child.material.map.needsUpdate = true;
      } else if (child.material) {
        // Preserve original material properties
        child.material.needsUpdate = true;
      }

      // Cannon.js collision shape creation
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

      // Optionally add normals for better rendering
      addNormals(child);
    }
  });

  console.log(
    "Model loaded successfully with its original materials and textures!"
  );
});

// WSAD Controls and Joystick for Ball Movement
let keyState = {}; // For PC controls
let joystickActive = false; // Flag for touch input
let joystickStart = { x: 0, y: 0 }; // Start position of the touch
let joystickDirection = { x: 0, y: 0 }; // Direction of the joystick

// WSAD Keyboard Controls
window.addEventListener("keydown", (event) => {
  keyState[event.code] = true;
});
window.addEventListener("keyup", (event) => {
  keyState[event.code] = false;
});

// Touch Start: Record the starting touch position
window.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  joystickActive = true;
  joystickStart.x = touch.clientX;
  joystickStart.y = touch.clientY;
});

// Touch Move: Calculate joystick direction
window.addEventListener("touchmove", (event) => {
  if (joystickActive) {
    const touch = event.touches[0];
    joystickDirection.x = (touch.clientX - joystickStart.x) / window.innerWidth; // Normalize to [-1, 1]
    joystickDirection.y =
      (joystickStart.y - touch.clientY) / window.innerHeight; // Normalize to [-1, 1]
  }
});

// Touch End: Reset joystick
window.addEventListener("touchend", () => {
  joystickActive = false;
  joystickDirection.x = 0;
  joystickDirection.y = 0;
});

// Function to handle ball movement
function handleBallMovement() {
  const speed = 0.1;

  // PC Controls
  if (keyState["KeyW"]) ballBody.velocity.z += speed;
  if (keyState["KeyS"]) ballBody.velocity.z -= speed;
  if (keyState["KeyA"]) ballBody.velocity.x += speed;
  if (keyState["KeyD"]) ballBody.velocity.x -= speed;

  // Mobile Touch Joystick Controls
  if (joystickActive) {
    ballBody.velocity.z += joystickDirection.y * speed; // Forward/backward
    ballBody.velocity.x += joystickDirection.x * speed; // Left/right
  }
}

// Ball End Point Coordinates
const endPoint = new THREE.Vector3(-1.71, 12.13, 60.18);

// Flag to check if the game is finished
let gameFinished = false;

// Function to display "You Pass" Card
function showPassCard() {
  const card = document.createElement("div");
  card.style.position = "absolute";
  card.style.top = "50%";
  card.style.left = "50%";
  card.style.transform = "translate(-50%, -50%)";
  card.style.backgroundColor = "#4CAF50";
  card.style.color = "white";
  card.style.fontSize = "24px";
  card.style.padding = "20px";
  card.style.borderRadius = "10px";
  card.innerText = "You Pass!";
  document.body.appendChild(card);
}

// Function to stop the simulation
function stopSimulation() {
  gameFinished = true;
  // Stop the animation loop
  cancelAnimationFrame(animationId); // animationId will be used to cancel the requestAnimationFrame loop
}

// Button to pause the simulation
const pauseButtonPositions = [
  new THREE.Vector3(-41.42, 9.71, -10.54),
  new THREE.Vector3(-63.64, 6.96, 7.03),
  new THREE.Vector3(-43.07, 5.76, 35.21),
  new THREE.Vector3(-25.03, 5.27, 36.64),
];

function isBallAtPauseCoordinates() {
  const ballPosition = ballBody.position;

  // Loop through each target position and check if the ball is near
  return pauseButtonPositions.some(
    (pos) =>
      Math.abs(ballPosition.x - pos.x) < 1 &&
      Math.abs(ballPosition.y - pos.y) < 1 &&
      Math.abs(ballPosition.z - pos.z) < 1
  );
}

let isPaused = false; // Track if the game is paused

// Function to pause the game
function pauseGame() {
  isPaused = true; // Set the game state to paused
  cancelAnimationFrame(animationId); // Stop the animation loop
}

// Function to resume the game
function resumeGame() {
  isPaused = false; // Set the game state to unpaused
  animate(); // Restart the animation loop
}
document.getElementById("pauseButton").addEventListener("click", function () {
  if (isPaused) {
    resumeGame(); // If the game is paused, resume it
  } else {
    pauseGame(); // If the game is running, pause it
  }
});

// Animation loop
let animationId;
function animate() {
  if (gameFinished || isPaused) return; // Stop the simulation if the game is finished

  animationId = requestAnimationFrame(animate);

  // Check if the ball has reached the end point
  const ballPosition = ballBody.position;
  if (
    Math.abs(ballPosition.x - endPoint.x) < 1 &&
    Math.abs(ballPosition.y - endPoint.y) < 1 &&
    Math.abs(ballPosition.z - endPoint.z) < 1
  ) {
    stopSimulation(); // Stop the simulation
    showPassCard(); // Show "You Pass" card
    return;
  }

  // Check if the ball has fallen off the map
  checkBallFallOff();

  // Update physics world
  world.step(1 / 60);

  // Handle ball movement
  handleBallMovement();

  // Update ball mesh with physics updates
  ballMesh.position.copy(ballBody.position);
  ballMesh.quaternion.copy(ballBody.quaternion);

  // Camera follows the ball
  const cameraYOffset = 15; // Fixed height for the camera
  const cameraZOffset = -8; // Fixed distance behind the ball in Z-direction
  camera.position.x = ballBody.position.x + 6;
  camera.position.y = cameraYOffset;
  camera.position.z = ballBody.position.z + cameraZOffset;
  camera.lookAt(ballBody.position.x, ballBody.position.y, ballBody.position.z);

  const pauseButton = document.getElementById("pauseButton");
  if (isBallAtPauseCoordinates()) {
    pauseButton.style.display = "block"; // Show the button when the ball is at the target position
  } else {
    pauseButton.style.display = "none"; // Hide the button otherwise
  }

  // Render the scene
  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export default Model;
