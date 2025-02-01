import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const DockerModel = () => {

  const containerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      30,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Fixed Typo

    function addArrowHelper(direction, color) {
      const arrowSize = 10; // Increase size for better visibility
      const origin = new THREE.Vector3(0, 5, 0); // Lift arrows above ground for visibility
      const arrow = new THREE.ArrowHelper(
          direction.clone().normalize(), // Ensure the direction is normalized
          origin,
          arrowSize,
          color
      );
      scene.add(arrow);
  }
    

    const lightDirections = [
      new THREE.Vector3(-5, -5, 0),  // Front-right
      // new THREE.Vector3(-1, 1, 0), // Front-left
      // new THREE.Vector3(0, 1, 1),  // Top-front
      // new THREE.Vector3(0, -1, 1)  // Bottom-front
  ];
  
  // Add arrows for each direction
//   const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; // Colors: Red, Green, Blue, Yellow
//   lightDirections.forEach((dir, index) => {
//       addArrowHelper(dir, colors[index]);
//   });

//   // top light
//   const directionalLight = new THREE.DirectionalLight(0xf2f5f3, 1); // White light, full intensity
// directionalLight.position.set(-5, -5, 0); // Adjust direction from (X, Y, Z)
// directionalLight.target.position.set(0, 0, 0); // Light aims at the center

// scene.add(directionalLight);
// scene.add(directionalLight.target); // Ensure target is added to the scene

    

    containerRef.current.appendChild(renderer.domElement);

    // ✅ Dynamically Set Camera Position based on Screen Width
    const updateCamera = () => {
      const width = window.innerWidth;

      if (width > 1910) {
        camera.position.set(0, 3, 34); // FHD and Higher
      } else if (width > 1024) {
        camera.position.set(0, 3, 36); // Desktop
      } else if (width > 900) {
        camera.position.set(0, 3, 34); // Tablet
      }else if (width > 784) {
        camera.position.set(0, 3, 44); // Tablet
      } else {
        camera.position.set(0, 3, 20); // Mobile
      }

      camera.updateProjectionMatrix();
    };

    updateCamera();

    // ✅ Load 3D Model
    const loader = new GLTFLoader();
    loader.load(
      "./models/docker/docker.glb",
      (gltf) => {
        const loadedModel = gltf.scene;
        
        // ✅ Scale the model based on screen size
        if (window.innerWidth > 1910) {
          loadedModel.scale.set(1.5, 1.5, 1.5);
        } else if (window.innerWidth > 1024) {
          loadedModel.scale.set(1.2, 1.2, 1.2);
        } else {
          loadedModel.scale.set(1, 1, 1);
        }

        scene.add(loadedModel);
        setModel(loadedModel);
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
      (error) => console.error("Error loading model:", error)
    );

    const directionalLightRight = new THREE.DirectionalLight(0xf2f5f3, 2);
directionalLightRight.position.set(2, 1, 0); // Right side
scene.add(directionalLightRight);

const directionalLightLeft = new THREE.DirectionalLight(0xf2f5f3, 2);
directionalLightLeft.position.set(-2, 1, 0); // Left side (mirrored)
scene.add(directionalLightLeft);

const directionalLightTopFrontRight = new THREE.DirectionalLight(0xf2f5f3, 2);
directionalLightTopFrontRight.position.set(0, 1, 1); // Top-front-right
scene.add(directionalLightTopFrontRight);

const directionalLightTopFrontLeft = new THREE.DirectionalLight(0xf2f5f3, 2);
directionalLightTopFrontLeft.position.set(0, 1, -1); // Top-front-left (mirrored)
scene.add(directionalLightTopFrontLeft);

const directionalLightBottomFrontRight = new THREE.DirectionalLight(0xf2f5f3, 2);
directionalLightBottomFrontRight.position.set(0, -1, 1); // Bottom-front-right
scene.add(directionalLightBottomFrontRight);

const directionalLightBottomFrontLeft = new THREE.DirectionalLight(0xf2f5f3, 2);
directionalLightBottomFrontLeft.position.set(0, -1, -1); // Bottom-front-left (mirrored)
scene.add(directionalLightBottomFrontLeft);

// Add ambient light to soften shadows
const ambientLight = new THREE.AmbientLight(0xf2f5f3, 0.3);
scene.add(ambientLight);


   
    // ✅ Add Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = false;

    // ✅ Resize Handler for Responsiveness
    const handleResize = () => {
      setScreenSize(window.innerWidth);
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      updateCamera();
    };

    window.addEventListener("resize", handleResize);

    // ✅ Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (model) model.rotation.y += 0.00005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ✅ Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [screenSize]);

  return (
    <div ref={containerRef} 
      className="z-50 cursor-pointer"
      style={{
        width: "100%",
        maxWidth: "1000px",
        height: window.innerWidth > 768 ? "80vh" : "40vh",
        maxHeight: "600px",
      }}
    />
  );
};

export default DockerModel;
