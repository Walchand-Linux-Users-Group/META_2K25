import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import SessionCards from "./SessionCard";

const BallSimulation = () => {
  const mountRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showPauseCard, setShowPauseCard] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  var idx = 1;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.2,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Choose the type of shadow map
    mountRef.current.appendChild(renderer.domElement);
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

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
        friction: 0.1,
        restitution: 0.3,
      }
    );
    world.addContactMaterial(ballContactMaterial);

    const loader = new GLTFLoader();
    let ballMesh;
    let track;

    loader.load("/models/ballbody.glb", (gltf) => {
      ballMesh = gltf.scene;
      ballMesh.scale.set(0.5, 0.5, 0.5);
      ballMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; // Enable shadow casting
          child.receiveShadow = true; // Enable shadow receiving
        }
      });
      scene.add(ballMesh);
    });

    const ballBody = new CANNON.Body({
      mass: 3000,
      material: ballMaterial,
      shape: new CANNON.Sphere(0.5),
    });
    ballBody.position.set(0, 15, 0);
    world.addBody(ballBody);

    loader.load("/models/t690.glb", (gltf) => {
      track = gltf.scene;
      track.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; // Enable shadow casting
          child.receiveShadow = true; // Enable shadow receiving

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

      scene.add(track);

      console.log(
        "Track model loaded successfully with its original materials and textures!"
      );
    });

    // Create starry background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const light1 = new THREE.DirectionalLight(0xffffff, 2, 100);
    light1.position.set(22, 20, 10);
    light1.castShadow = true; // Enable shadows for this light
    light1.shadow.camera.left = -100; // Extend left boundary
    light1.shadow.camera.right = 100; // Extend right boundary
    light1.shadow.camera.top = 100; // Extend top boundary
    light1.shadow.camera.bottom = -100; // Extend bottom boundary
    light1.shadow.mapSize.width = 4096; // Higher resolution (default is 512)
    light1.shadow.mapSize.height = 4096;
    light1.shadow.camera.near = 1; // Adjust near clipping plane
    light1.shadow.camera.far = 510; // Adjust far clipping plane
    scene.add(light1);
    // const shadowHelper = new THREE.CameraHelper(light1.shadow.camera);
    // scene.add(shadowHelper);

    const light2 = new THREE.DirectionalLight(0xffffff, 1, 100);
    light2.position.set(1, 140, 300);
    light2.castShadow = true; // Enable shadows for this light
    light2.castShadow = true; // Enable shadows for this light
    light2.shadow.camera.left = -100; // Extend left boundary
    light2.shadow.camera.right = 100; // Extend right boundary
    light2.shadow.camera.top = 100; // Extend top boundary
    light2.shadow.camera.bottom = -100; // Extend bottom boundary
    light2.shadow.mapSize.width = 4096; // Higher resolution (default is 512)
    light2.shadow.mapSize.height = 4096;
    light2.shadow.camera.near = 100; // Adjust near clipping plane
    light2.shadow.camera.far = 300;
    scene.add(light2);
    // const shadowHelper = new THREE.CameraHelper(light2.shadow.camera);
    // scene.add(shadowHelper);

    const light3 = new THREE.DirectionalLight(0xffffff, 1, 100);
    light3.position.set(50, 10, 38); // Enable shadows for this light
    // scene.add(light3);

    const light4 = new THREE.DirectionalLight(0xffffff, 1, 100);
    light4.position.set(-39.38, 5.76, 40.06); // Enable shadows for this light
    // scene.add(light4);

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
      new THREE.Vector4(-41.93, 9.71, -10.36, 1),
      new THREE.Vector4(-63.82, 6.94, 7.56, 2),
      new THREE.Vector4(-43.49, 5.75, 34.59, 3),
      new THREE.Vector4(-24.97, 5.26, 35.1, 4),
    ];

    // new coords
    //  -41.11, Y: 9.69, Z: -9.28
    //  X: -20.88, Y: 6.94, Z: -2.94
    // -3.39, Y: 6.94, Z: -7.50
    //  X: -24.97, Y: 5.26, Z: 35.10

    const endPoint = new THREE.Vector3(-1.56, 12.12, 60.29);

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

    //debugger to get ball coordinates
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

    window.addEventListener("keydown", (event) => {
      keyState[event.code] = true;

      // Allow exiting the stuck state using keypresses
      if (isStuck) {
        setIsStuck(false);
        setShowPauseCard(false);
        setIsPaused(false);
      }
    });

    window.addEventListener("keyup", (event) => {
      keyState[event.code] = false;
    });

    function setupJoystick() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobile = /android|iPad|iPhone|iPod/i.test(userAgent);

      if (!isMobile) {
        return;
      }
      const joystick = document.createElement("div");
      joystick.style.position = "absolute";
      joystick.style.bottom = "15%";
      joystick.style.left = "50%";
      joystick.style.width = "150px";
      joystick.style.height = "150px";
      joystick.style.border = "2px solid #aaa";
      joystick.style.borderRadius = "50%";
      joystick.style.background = "rgba(255, 255, 255, 0.5)";
      joystick.style.zIndex = "1000";
      joystick.style.opacity = "0.3";
      joystick.style.touchAction = "none";
      joystick.style.transform = "translateX(-50%)";
      document.body.appendChild(joystick);

      const handle = document.createElement("div");
      handle.style.position = "absolute";
      handle.style.width = "50px";
      handle.style.height = "50px";
      handle.style.opacity = "0.4";
      handle.style.background = "rgba(0, 0, 0, 0.7)";
      handle.style.borderRadius = "50%";
      handle.style.left = "50%";
      handle.style.top = "50%";
      handle.style.transform = "translate(-50%, -50%)";
      joystick.appendChild(handle);

      let initialTouch = null;

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

    function handleBallMovement(deltaTime) {
      const baseSpeed = 7;
      const damping = Math.pow(0.99, deltaTime * 60);

      const speed = baseSpeed * deltaTime;

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
        const adjustedSpeed = speed * deltaTime * 45;

        ballBody.velocity.x +=
          joystickPosition.y * forwardVector.x * adjustedSpeed;
        ballBody.velocity.z +=
          joystickPosition.y * forwardVector.z * adjustedSpeed;
        ballBody.velocity.x +=
          -joystickPosition.x * rightVector.x * adjustedSpeed;
        ballBody.velocity.z +=
          -joystickPosition.x * rightVector.z * adjustedSpeed;
      } else {
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
        (pos) => calculateDistance(ballPosition, pos) < 3
      );
    }

    let isAttached = false; // Flag to track if the ball is attached

    function magneticEffect() {
      const ballPosition = ballBody.position;

      if (isAttached) return; // Skip applying magnetic effect if already attached

      pauseButtonPositions.forEach((pos) => {
        const distance = calculateDistance(ballPosition, pos);

        if (distance < 3) {
          const force = new CANNON.Vec3(
            (pos.x - ballPosition.x) * 10,
            (pos.y - ballPosition.y) * 10,
            (pos.z - ballPosition.z) * 10
          );
          ballBody.applyForce(force, ballBody.position);

          // Gradually move toward the position if close
          if (distance < 0.8) {
            idx = pos.w;
            console.log(pos.w);
            setShowPauseCard(true);
            isAttached = true; // Mark as attached

            // Gradual movement logic
            const interval = setInterval(() => {
              ballBody.velocity.set(0, 0, 0); // Stop velocity for smooth control
              ballBody.angularVelocity.set(0, 0, 0); // Stop angular velocity

              const lerpFactor = 0.08; // Adjust for smoother or faster transitions
              ballBody.position.x += (pos.x - ballPosition.x) * lerpFactor;
              ballBody.position.y += (pos.y - ballPosition.y) * lerpFactor;
              ballBody.position.z += (pos.z - ballPosition.z) * lerpFactor;

              const currentDistance = calculateDistance(ballPosition, pos);

              // Stop interpolation once very close to the target
              if (currentDistance < 0.05) {
                clearInterval(interval);
                ballBody.position.set(pos.x, pos.y, pos.z); // Snap to exact position

                // Automatically release after 3 seconds
                setTimeout(() => {
                  isAttached = false;
                  setShowPauseCard(false); // Release the ball
                }, 800); // Stuck duration: 1 second
              }
            }, 16); // 60 FPS update interval
          }
        }
      });
    }

    let lastTime = performance.now();

    function animate() {
      if (gameFinished || isPaused) return;

      animationId = requestAnimationFrame(animate);

      const ballPosition = ballBody.position;
      if (
        Math.abs(ballPosition.x - endPoint.x) < 0.4 &&
        Math.abs(ballPosition.y - endPoint.y) < 0.4 &&
        Math.abs(ballPosition.z - endPoint.z) < 0.4
      ) {
        stopSimulation();
        showPassCard();
        return;
      }

      checkBallFallOff();
      magneticEffect();
      world.step(1 / 60);

      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      handleBallMovement(deltaTime);
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

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    };
  }, [isPaused, gameFinished]);

  return (
    <div ref={mountRef}>
      {/* button to log coords */}
      {<button id="logBallCoords">Log Ball Coordinates</button>}

      {showPauseCard && <SessionCards selectedSessionIndex={idx - 1} />}
    </div>
  );
};

export default BallSimulation;
