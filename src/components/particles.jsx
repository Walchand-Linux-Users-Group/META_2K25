import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleBackground = ({ speed = 0.1, starSize = 0.15 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
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
      const size = 16;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = 'white';
      context.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const circleTexture = createCircleTexture();

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    // Star Material with Purplish Color
    const starMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(0x8D5FF4), // Purplish color
      size: starSize,
      map: circleTexture,
      transparent: true,
      opacity: 0.7
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Particles
    const particles = [];
    const numParticles = 400;

    for (let i = 0; i < numParticles; i++) {
      const geometry = new THREE.CircleGeometry(0.5, 32);
      const yPos = Math.random() * 600 - 300;
      const color = yPos > 0 ? 0x87CEEB : 0x00008B;

      const material = new THREE.MeshStandardMaterial({ color: color, opacity: 0.7, transparent: true });
      const particle = new THREE.Mesh(geometry, material);

      particle.position.set(
        Math.random() * 600 - 300,
        yPos,
        Math.random() * 600 - 300
      );

      particle.scale.set(Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, 1);

      particle.velocity = new THREE.Vector3(
        Math.random() * 0.3 - 0.15,
        Math.random() * 0.3 - 0.15,
        Math.random() * 0.3 - 0.15
      );

      particles.push(particle);
      scene.add(particle);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update particles' positions
      particles.forEach(particle => {
        particle.position.add(particle.velocity);

        if (particle.position.x > 300 || particle.position.x < -300) particle.velocity.x *= -1;
        if (particle.position.y > 300 || particle.position.y < -300) particle.velocity.y *= -1;
        if (particle.position.z > 300 || particle.position.z < -300) particle.velocity.z *= -1;
      });

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
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [speed, starSize]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0 
      }}
    />
  );
};

export default ParticleBackground;
