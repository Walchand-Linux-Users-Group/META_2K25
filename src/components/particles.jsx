import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ParticleBackground = ({ speed = 0.1, starSize = 0.15 }) => {
  const mountRef = useRef(null);
  const [starCount, setStarCount] = useState(window.innerWidth < 768 ? 2000 : 5000); // Adjust for mobile

  useEffect(() => {
    // Detect mobile and adjust star count
    const handleResize = () => {
      setStarCount(window.innerWidth < 768 ? 2000 : 5000);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create a circular texture
    const createCircleTexture = () => {
      const size = 32;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const circleTexture = createCircleTexture();

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    // Star Material
    const starMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(0x0abfba),
      size: starSize,
      map: circleTexture,
      transparent: true,
      opacity: 0.7,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Starfield Animation
      const positions = stars.geometry.attributes.position.array;
      for (let i = 0; i < starCount * 3; i += 3) {
        positions[i + 2] += speed;
        if (positions[i + 2] > 5) {
          positions[i + 2] = -60;
        }
      }
      stars.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Adjust canvas size on window resize
    const resizeListener = () => {
      if (mountRef.current) {
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", resizeListener);
    resizeListener(); // Call once to set initial size

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeListener);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [speed, starSize, starCount]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        pointerEvents : "none",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default ParticleBackground;
