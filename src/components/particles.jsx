import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleBackground() {
    const canvasRef = useRef(null);  // Ref to track the canvas div

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        // Append canvas to the ref div only once
        if (canvasRef.current && !canvasRef.current.hasChildNodes()) {
            renderer.setSize(window.innerWidth, window.innerHeight);
            canvasRef.current.appendChild(renderer.domElement);  // Append the canvas once
        }

        // Array to store particles
        const particles = [];
        const numParticles = 400;

        // Create particles (square)
        for (let i = 0; i < numParticles; i++) {
            const geometry = new THREE.PlaneGeometry(1, 1); // Smaller square particle
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true });
            const particle = new THREE.Mesh(geometry, material);

            // Set random position (smaller range to keep particles within view)
            particle.position.set(
                Math.random() * 600 - 300,  // X position
                Math.random() * 600 - 300,  // Y position
                Math.random() * 600 - 300   // Z position
            );

            particle.scale.set(Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, 1); // Smaller scale between 0.5 and 2

            // Add random velocity for each particle (increased speed)
            particle.velocity = new THREE.Vector3(
                Math.random() * 0.3 - 0.15,  // Random X velocity (faster)
                Math.random() * 0.3 - 0.15,  // Random Y velocity (faster)
                Math.random() * 0.3 - 0.15   // Random Z velocity (faster)
            );

            particles.push(particle);
            scene.add(particle);
        }

        // Set camera position closer
        camera.position.z = 100;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Update particles' positions
            particles.forEach(particle => {
                // Update position based on velocity
                particle.position.add(particle.velocity);

                // Make sure particles stay within the view (loop around)
                if (particle.position.x > 300 || particle.position.x < -300) particle.velocity.x *= -1;
                if (particle.position.y > 300 || particle.position.y < -300) particle.velocity.y *= -1;
                if (particle.position.z > 300 || particle.position.z < -300) particle.velocity.z *= -1;
            });

            // Render the scene
            renderer.render(scene, camera);
        }

        animate();

        // Adjust canvas size on window resize
        const resizeListener = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
        
        window.addEventListener("resize", resizeListener);

        // Clean up the renderer and event listener on component unmount
        return () => {
            window.removeEventListener("resize", resizeListener);
            renderer.dispose();
        };
    }, []);  // The empty array ensures this effect runs only once

    return <div className='fixed top-0 left-0 w-full h-full z-0 pointer-events-none' ref={canvasRef}></div>;
// Attach the ref to the div
}
