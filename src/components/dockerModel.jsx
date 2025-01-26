import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const DockerModel = () => {
  const containerRef = useRef(null);
  let modelRef = useRef(null);

  useEffect(() => {
 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        30,  
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );

    //   window.innerWidth > 768 ? camera.position.set(0, 3, 15) : camera.position.set(0, 3, 25);
      window.innerWidth > 1024 ? camera.position.set(0, 3, 20) : camera.position.set(0, 3, 20);
      

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelR35atio);
    containerRef.current.appendChild(renderer.domElement);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    // Load the model
    const loader = new GLTFLoader();
    loader.load(
        "./models/docker/docker.glb",
        (gltf) => {
          const model = gltf.scene;
          
         
          model.scale.set(1,1,1);  
         
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
      
          scene.add(model);
          modelRef.current = model;
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.error("Error loading model:", error);
        }
      );
      

  

    // Add multiple directional lights for even lighting
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight1.position.set(-50, -50, 50);
    scene.add(directionalLight2);



    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight3.position.set(0, 5, -5);
    scene.add(directionalLight3);



    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1);
    scene.add(hemisphereLight);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = false;  



    const handleResize = () => {
        if (containerRef.current) {
          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        }
      };
      
      window.addEventListener("resize", handleResize);
      

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        modelRef.current.rotation.y += 0.0005; // Rotate model around Y-axis
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return window.innerWidth > 768 ?  <div ref={containerRef} className="z-50 cursor-pointer" id="container3D" 
            style={{ width: "100%", maxWidth: "800px", height: "60vh", maxHeight: "500px" }} /> : 
             <div ref={containerRef} className="z-50 cursor-pointer" id="container3D" 
            style={{ width: "100%", height: "40vh" }} /> 

};

export default DockerModel;