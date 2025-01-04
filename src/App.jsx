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
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(8, 17, -10);
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
    restitution: 0,
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
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Adding a global light (ambient light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Load track and debug slopes
const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Load the texture for the model (image stored in the public folder)
const texture = textureLoader.load("/image.png"); // Path to your texture file in the public folder

const config = {
  trackModelPath: "/models/main_track.glb",
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
function addNormals(mesh, color = 0xffffff) {
  if (mesh.geometry.attributes.normal) {
    const wireframe = new THREE.WireframeGeometry(mesh.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.LineSegments(wireframe, lineMaterial);
    mesh.add(line);
  }
}

loader.load(config.trackModelPath || "/models/main_track.glb", (gltf) => {
  const track = gltf.scene;
  scene.add(track);

  track.traverse((child) => {
    if (child.isMesh) {
      // Apply texture to the model's material
      child.material = new THREE.MeshStandardMaterial({
        map: texture, // Apply the loaded texture here
      });

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
    }
  });
});

// WSAD Controls for Ball Movement
let keyState = {};
window.addEventListener("keydown", (event) => {
  keyState[event.code] = true;
});
window.addEventListener("keyup", (event) => {
  keyState[event.code] = false;
});

// Function to handle ball movement
function handleBallMovement() {
  const speed = 0.1;

  if (keyState["KeyS"]) ballBody.velocity.z -= speed;
  if (keyState["KeyW"]) ballBody.velocity.z += speed;
  if (keyState["KeyD"]) ballBody.velocity.x -= speed;
  if (keyState["KeyA"]) ballBody.velocity.x += speed;
}

// Ball End Point Coordinates
// const endPoint = new THREE.Vector3(0, 6.95, 0);
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

// Animation loop
let animationId;
function animate() {
  if (gameFinished) return; // Stop the simulation if the game is finished

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
  }

  // Check if the ball has fallen off the map
  checkBallFallOff();

  world.step(1 / 60);
  handleBallMovement();

  // Update ball mesh with physics updates
  ballMesh.position.copy(ballBody.position);
  ballMesh.quaternion.copy(ballBody.quaternion);

  // Camera follows the ball
  const cameraYOffset = 17; // Fixed height for the camera
  const cameraZOffset = -10; // Fixed distance behind the ball in Z-direction
  camera.position.x = ballBody.position.x;
  camera.position.y = cameraYOffset;
  camera.position.z = ballBody.position.z + cameraZOffset;
  camera.lookAt(ballBody.position.x, ballBody.position.y, ballBody.position.z);

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

export default App;
