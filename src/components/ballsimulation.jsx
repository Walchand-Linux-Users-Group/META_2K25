import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

const BallSimulation = () => {
  const mountRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    // Initialize Three.js and Cannon.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.2,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.set(16, 22, -26);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 1;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.enableZoom = true;

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    const trackMaterial = new CANNON.Material("trackMaterial");
    const ballMaterial = new CANNON.Material("ballMaterial");
    const ballContactMaterial = new CANNON.ContactMaterial(
      trackMaterial,
      ballMaterial,
      {
        friction: 0.1, // Adjusted friction
        restitution: 0.3,
      }
    );
    world.addContactMaterial(ballContactMaterial);

    const loader = new GLTFLoader();
    let ballMesh;
    let track;

    // Load custom ball model
    loader.load("/models/ballbody.glb", (gltf) => {
      ballMesh = gltf.scene;
      ballMesh.scale.set(0.5, 0.5, 0.5); // Adjust the scale if necessary
      scene.add(ballMesh);
    });

    const ballBody = new CANNON.Body({
      mass: 3000,
      material: ballMaterial,
      shape: new CANNON.Sphere(0.5),
    });
    ballBody.position.set(0, 15, 0);
    world.addBody(ballBody);

    // Load custom track model
    loader.load("/models/untitled.glb", (gltf) => {
      track = gltf.scene;
      scene.add(track);

      track.traverse((child) => {
        if (child.isMesh) {
          if (child.material && child.material.map) {
            child.material.map.needsUpdate = true;
          } else if (child.material) {
            child.material.needsUpdate = true;
          }

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

          body.position.set(0, 0, 0);
          body.quaternion.setFromEuler(0, 0, 0);

          world.addBody(body);
        }
      });

      console.log(
        "Track model loaded successfully with its original materials and textures!"
      );
    });

    const light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

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

    const pauseButtonPositions = [
      new THREE.Vector3(-41.42, 9.71, -10.54),
      new THREE.Vector3(-63.64, 6.96, 7.03),
      new THREE.Vector3(-43.07, 5.76, 35.21),
      new THREE.Vector3(-25.03, 5.27, 36.64),
    ];

    const endPoint = new THREE.Vector3(-1.71, 12.13, 60.18);

    let keyState = {};
    let joystickPosition = { x: 0, y: 0 };
    let isJoystickActive = false;
    let animationId;

    const logCoordsButton = document.getElementById("logBallCoords");

    function logBallCoordinates() {
      const ballPosition = ballBody.position;
      console.log(
        `Ball Coordinates: X: ${ballPosition.x.toFixed(
          2
        )}, Y: ${ballPosition.y.toFixed(2)}, Z: ${ballPosition.z.toFixed(2)}`
      );
    }

    logCoordsButton.addEventListener("click", logBallCoordinates);

    function calculateDistance(p1, p2) {
      return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
          Math.pow(p2.y - p1.y, 2) +
          Math.pow(p2.z - p1.z, 2)
      );
    }

    function findNearestRespawnPoint(ballPosition) {
      let closestPoint = respawnPoints[0];
      let minDistance = calculateDistance(ballPosition, closestPoint);

      for (let i = 1; i < respawnPoints.length; i++) {
        const distance = calculateDistance(ballPosition, respawnPoints[i]);
        if (distance < minDistance) {
          closestPoint = respawnPoints[i];
          minDistance = distance;
        }
      }
      return closestPoint;
    }

    function checkBallFallOff() {
      const ballPosition = ballBody.position;

      if (ballPosition.y < -1) {
        const nearestRespawn = findNearestRespawnPoint(ballPosition);
        ballBody.position.set(
          nearestRespawn.x,
          nearestRespawn.y + 2,
          nearestRespawn.z
        );
        ballBody.velocity.set(0, 0, 0);
        ballBody.angularVelocity.set(0, 0, 0);
        keyState = {};
        if (ballMesh) {
          ballMesh.position.copy(ballBody.position);
          ballMesh.quaternion.copy(ballBody.quaternion);
        }
      }
    }

    // Event Listeners for Keyboard Controls
    window.addEventListener("keydown", (event) => {
      keyState[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      keyState[event.code] = false;
    });

    function setupJoystick() {
      // Detect if the user is on a mobile device
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobile = /android|iPad|iPhone|iPod/i.test(userAgent);

      // Render the joystick only on mobile
      if (!isMobile) {
        return; // Exit if not on a mobile device
      }

      // Create joystick container
      const joystick = document.createElement("div");
      joystick.style.position = "absolute";
      joystick.style.bottom = "25%"; // Adjust this to control vertical positioning
      joystick.style.left = "50%";
      joystick.style.width = "150px";
      joystick.style.height = "150px";
      joystick.style.border = "2px solid #aaa";
      joystick.style.borderRadius = "50%";
      joystick.style.background = "rgba(255, 255, 255, 0.5)";
      joystick.style.zIndex = "1000";
      joystick.style.opacity = "0.3";
      joystick.style.touchAction = "none"; // Prevents browser default touch behavior
      joystick.style.transform = "translateX(-50%)"; // Center horizontally
      document.body.appendChild(joystick);

      // Create joystick handle
      const handle = document.createElement("div");
      handle.style.position = "absolute";
      handle.style.width = "50px";
      handle.style.height = "50px";
      handle.style.opacity = "0.4";
      handle.style.background = "rgba(0, 0, 0, 0.7)";
      handle.style.borderRadius = "50%";
      handle.style.left = "50%";
      handle.style.top = "50%";
      handle.style.transform = "translate(-50%, -50%)"; // Center inside the joystick
      joystick.appendChild(handle);

      let initialTouch = null;
      let isJoystickActive = false;
      const joystickPosition = { x: 0, y: 0 };

      joystick.addEventListener("touchstart", (event) => {
        isJoystickActive = true;
        initialTouch = event.touches[0];
      });

      joystick.addEventListener("touchmove", (event) => {
        if (!isJoystickActive) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - initialTouch.clientX;
        const deltaY = touch.clientY - initialTouch.clientY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 50;
        const angle = Math.atan2(deltaY, deltaX);

        const clampedDistance = Math.min(distance, maxDistance);
        const x = clampedDistance * Math.cos(angle);
        const y = clampedDistance * Math.sin(angle);

        joystickPosition.x = x / maxDistance;
        joystickPosition.y = y / maxDistance;

        handle.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
      });

      joystick.addEventListener("touchend", () => {
        isJoystickActive = false;
        joystickPosition.x = 0;
        joystickPosition.y = 0;
        handle.style.transform = "translate(-50%, -50%)";
      });
    }

    // Call the function to initialize the joystick
    setupJoystick();

    function handleBallMovement() {
      const speed = 0.1;
      const damping = 0.989;

      const forwardVector = {
        x: Math.sin(
          Math.atan2(
            ballBody.position.z - camera.position.z,
            ballBody.position.x - camera.position.x
          )
        ),
        z: Math.cos(
          Math.atan2(
            ballBody.position.z - camera.position.z,
            ballBody.position.x - camera.position.x
          )
        ),
      };

      const rightVector = {
        x: -forwardVector.z,
        z: forwardVector.x,
      };

      if (isJoystickActive) {
        ballBody.velocity.x += joystickPosition.y * forwardVector.x * speed;
        ballBody.velocity.z += joystickPosition.y * forwardVector.z * speed;
        ballBody.velocity.x += -(joystickPosition.x * rightVector.x * speed);
        ballBody.velocity.z += -(joystickPosition.x * rightVector.z * speed);
      } else {
        // Apply damping to simulate inertia
        ballBody.velocity.x *= damping;
        ballBody.velocity.z *= damping;
      }

      if (keyState["KeyS"]) {
        ballBody.velocity.z -= speed;
        ballBody.velocity.x += speed;
      }
      if (keyState["KeyW"]) {
        ballBody.velocity.x -= speed;
        ballBody.velocity.z += speed;
      }
      if (keyState["KeyD"]) {
        ballBody.velocity.x -= speed;
        ballBody.velocity.z -= speed;
      }
      if (keyState["KeyA"]) {
        ballBody.velocity.x += speed;
        ballBody.velocity.z += speed;
      }
    }

    setupJoystick();

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

    function stopSimulation() {
      setGameFinished(true);
      cancelAnimationFrame(animationId);
    }

    function isBallAtPauseCoordinates() {
      const ballPosition = ballBody.position;
      return pauseButtonPositions.some(
        (pos) =>
          Math.abs(ballPosition.x - pos.x) < 1 &&
          Math.abs(ballPosition.y - pos.y) < 1 &&
          Math.abs(ballPosition.z - pos.z) < 1
      );
    }

    function animate() {
      if (gameFinished || isPaused) return;

      animationId = requestAnimationFrame(animate);

      const ballPosition = ballBody.position;
      if (
        Math.abs(ballPosition.x - endPoint.x) < 1 &&
        Math.abs(ballPosition.y - endPoint.y) < 1 &&
        Math.abs(ballPosition.z - endPoint.z) < 1
      ) {
        stopSimulation();
        showPassCard();
        return;
      }

      checkBallFallOff();
      world.step(1 / 60);
      handleBallMovement();
      if (ballMesh) {
        ballMesh.position.copy(ballBody.position);
        ballMesh.quaternion.copy(ballBody.quaternion);
      }

      const cameraYOffset = 15;
      const cameraZOffset = -8;
      camera.position.x = ballBody.position.x + 6;
      camera.position.y = cameraYOffset;
      camera.position.z = ballBody.position.z + cameraZOffset;
      camera.lookAt(
        ballBody.position.x,
        ballBody.position.y,
        ballBody.position.z
      );

      const pauseButton = document.getElementById("pauseButton");
      const showCard = document.getElementById("skewed-card-container");
      if (isBallAtPauseCoordinates()) {
        pauseButton.style.display = "block";
        showCard.style.display = "block";
      } else {
        pauseButton.style.display = "none";
        showCard.style.display = "none";
      }

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      window.removeEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    };
  }, [isPaused, gameFinished]);

  const handlePauseButtonClick = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      animate();
    }
  };

  return (
    <div ref={mountRef}>
      <button id="logBallCoords">Log Ball Coordinates</button>
      <button id="pauseButton" onClick={handlePauseButtonClick}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <div id="skewed-card-container" />
    </div>
  );
};

export default BallSimulation;
