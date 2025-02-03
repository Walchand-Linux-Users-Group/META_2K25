import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const DockerModel = () => {
  const containerRef = useRef(null);
  const modelRef = useRef(null); // ✅ Use ref instead of state
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
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const updateCamera = () => {
      const width = window.innerWidth;
      if (width > 1910) {
        camera.position.set(0, 3, 34);
      } else if (width > 1024) {
        camera.position.set(0, 3, 36);
      } else if (width > 900) {
        camera.position.set(0, 3, 34);
      } else if (width > 784) {
        camera.position.set(0, 3, 44);
      } else {
        camera.position.set(0, 3, 20);
      }
      camera.updateProjectionMatrix();
    };

    updateCamera();

    const loader = new GLTFLoader();
    loader.load(
      "./models/docker/docker.glb",
      (gltf) => {
        const loadedModel = gltf.scene;
        modelRef.current = loadedModel; // ✅ Store model in ref

        if (window.innerWidth > 1910) {
          loadedModel.scale.set(1.5, 1.5, 1.5);
        } else if (window.innerWidth > 1024) {
          loadedModel.scale.set(1.2, 1.2, 1.2);
        } else {
          loadedModel.scale.set(1, 1, 1);
        }

        scene.add(loadedModel);
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
      (error) => console.error("Error loading model:", error)
    );

    const directionalLightRight = new THREE.DirectionalLight(0xf2f5f3, 2);
    directionalLightRight.position.set(2, 1, 0);
    scene.add(directionalLightRight);

    const directionalLightLeft = new THREE.DirectionalLight(0xf2f5f3, 2);
    directionalLightLeft.position.set(-2, 1, 0);
    scene.add(directionalLightLeft);

    const directionalLightTopFrontRight = new THREE.DirectionalLight(0xf2f5f3, 2);
    directionalLightTopFrontRight.position.set(0, 1, 1);
    scene.add(directionalLightTopFrontRight);

    const directionalLightTopFrontLeft = new THREE.DirectionalLight(0xf2f5f3, 2);
    directionalLightTopFrontLeft.position.set(0, 1, -1);
    scene.add(directionalLightTopFrontLeft);

    const directionalLightBottomFrontRight = new THREE.DirectionalLight(0xf2f5f3, 2);
    directionalLightBottomFrontRight.position.set(0, -1, 1);
    scene.add(directionalLightBottomFrontRight);

    const directionalLightBottomFrontLeft = new THREE.DirectionalLight(0xf2f5f3, 2);
    directionalLightBottomFrontLeft.position.set(0, -1, -1);
    scene.add(directionalLightBottomFrontLeft);

    const ambientLight = new THREE.AmbientLight(0xf2f5f3, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf2f5f3, 2);
    directionalLight.position.set(2, 3, 5);
    scene.add(directionalLight);

    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = false;

    const handleResize = () => {
      setScreenSize(window.innerWidth);
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      updateCamera();
    };

    window.addEventListener("resize", handleResize);

    let lastTime = 0;
    const rotationSpeed = 0.0001; // Adjust rotation speed here

    const animate = (time) => {
      requestAnimationFrame(animate);
      const delta = time - lastTime;
      lastTime = time;

      if (modelRef.current) {
        modelRef.current.rotation.y += rotationSpeed * delta; // ✅ Ensure model is referenced correctly
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [screenSize]);

  return (
    <div
      ref={containerRef}
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
