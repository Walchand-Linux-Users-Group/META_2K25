import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const KubernetesModel = () => {
  const containerRef = useRef(null);
  let modelRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      30,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );



    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const updateCamera = () => {
      const width = window.innerWidth;
    
      // Adjust camera position based on screen size
      if (width > 1910) {
        camera.position.set(0, 10, 50); // FHD and Higher
      } else if (width > 1024) {
        camera.position.set(0, 10, 45); // Desktop
      } else if (width > 900) {
        camera.position.set(0, 10, 30); // Tablet
      } else if (width > 784) {
        camera.position.set(0, 10, 40); // Small tablet
      } else {
        camera.position.set(0, 10, 20); // Mobile
      }
    
      camera.updateProjectionMatrix();
    };

    updateCamera();
    

    // Load 3D Model
    const loader = new GLTFLoader();
    loader.load(
      "./models/kubernetes/Kubes3d.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);

        // Compute Bounding Box
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Center Model
        model.position.sub(center);
        modelRef.current = model;
        scene.add(model);

        // Adjust Camera for a **FRONT VIEW**
        const size = box.getSize(new THREE.Vector3()).length();
        camera.position.set(0, 40,0); // Keep it in front
        camera.lookAt(model.position);
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


    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    // Handle Resize
    const handleResize = () => {
      if (containerRef.current) {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      // if (modelRef.current) {
      //   modelRef.current.rotation.y += 0.005; // Slight rotation for a better effect
      // }
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="z-50 cursor-pointer"
      id="container3D"
      style={{
        width: "100%",
        maxWidth: "800px",
        height: window.innerWidth > 768 ? "60vh" : "40vh",
        maxHeight: "500px",
      }}
    />
  );
};

export default KubernetesModel;
