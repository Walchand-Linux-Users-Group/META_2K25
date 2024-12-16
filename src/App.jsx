import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Ball() {
  const ballRef = useRef();
  const speed = 0.1;

  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });

  const handleKeyDown = (event) => {
    setKeys((prev) => ({ ...prev, [event.key.toLowerCase()]: true }));
  };

  const handleKeyUp = (event) => {
    setKeys((prev) => ({ ...prev, [event.key.toLowerCase()]: false }));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (ballRef.current) {
      if (keys.w) ballRef.current.position.z -= speed; 
      if (keys.s) ballRef.current.position.z += speed; 
      if (keys.a) ballRef.current.position.x -= speed;
      if (keys.d) ballRef.current.position.x += speed; 
    }
  });

  return (
    <mesh ref={ballRef} position={[0, 1, 0]} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 90 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={0.5} castShadow />
      <Ball />
      <Ground />
      <OrbitControls />
    </Canvas>
  );
}
