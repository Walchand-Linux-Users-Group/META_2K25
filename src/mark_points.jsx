
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
    friction: config.friction || 0.8,
    restitution: config.restitution || 0.1,
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
  config.ballStartPosition?.x || -63,
  config.ballStartPosition?.y || 10,
  config.ballStartPosition?.z || 23
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
  const force = config.ballForce || 15; // Reduced force for smoother movement
  const reducedForce = force * 0.5; // Half force for slopes

  if (keys.w) {
    ballBody.applyForce(
      new CANNON.Vec3(
        0,
        0,
        Math.abs(ballBody.velocity.y) > 0.5 ? -reducedForce : -force
      ),
      ballBody.position
    );
  }
  if (keys.s) {
    ballBody.applyForce(
      new CANNON.Vec3(
        0,
        0,
        Math.abs(ballBody.velocity.y) > 0.5 ? reducedForce : force
      ),
      ballBody.position
    );
  }
  if (keys.a) {
    ballBody.applyForce(
      new CANNON.Vec3(
        Math.abs(ballBody.velocity.x) > 0.5 ? -reducedForce : -force,
        0,
        0
      ),
      ballBody.position
    );
  }
  if (keys.d) {
    ballBody.applyForce(
      new CANNON.Vec3(
        Math.abs(ballBody.velocity.x) > 0.5 ? reducedForce : force,
        0,
        0
      ),
      ballBody.position
    );
  }
}

function handleSlopes() {
  world.addEventListener("postStep", () => {
    world.contacts.forEach((contact) => {
      const ballInvolved = contact.bi === ballBody || contact.bj === ballBody;
      const trackInvolved =
        contact.bi.material === trackMaterial ||
        contact.bj.material === trackMaterial;

      if (ballInvolved && trackInvolved) {
        const normal = contact.ni;
        const slopeThreshold = Math.cos((35 * Math.PI) / 180); // Tolerate up to 35 degrees

        if (normal.dot(new CANNON.Vec3(0, 1, 0)) < slopeThreshold) {
          // Apply damping to lateral velocities
          ballBody.velocity.x *= 0.9; // Damp X velocity
          ballBody.velocity.z *= 0.9; // Damp Z velocity
          ballBody.angularVelocity.x *= 0.8; // Damp angular X
          ballBody.angularVelocity.z *= 0.8; // Damp angular Z
        }
      }
    });
  });
}

// Initialize slope handling
handleSlopes();

// Assuming you have a scene and camera set up

// 1. Create a raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 2. Event listener for mouse click
window.addEventListener("click", onMouseClick, false);

function onMouseClick(event) {
  // Normalize mouse position (from screen space to normalized device coordinates)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 3. Set up the raycaster from the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Cast the ray and get all objects intersected
  const intersects = getIntersects();

  if (intersects.length > 0) {
    // 4. Get the intersection point
    const intersectedPoint = intersects[0].point;
    console.log("Intersected Point:", intersectedPoint);

    // Optionally, add a visual marker at the intersection
    addIntersectionMarker(intersectedPoint);
  }
}

function getIntersects() {
  // Intersect the objects in the scene
  const intersects = raycaster.intersectObjects(scene.children, true); // Check against all objects in the scene
  return intersects;
}

// Optionally, to debug the interaction, add a visual helper like a point or sphere at the intersection
function addIntersectionMarker(point) {
  const geometry = new THREE.SphereGeometry(0.1, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const marker = new THREE.Mesh(geometry, material);
  marker.position.copy(point);
  scene.add(marker);
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
