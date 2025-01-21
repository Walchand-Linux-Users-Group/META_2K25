// BackgroundEffects.js
import React from "react";
import { Stars, Sparkles } from "@react-three/drei";

const BackgroundEffects = () => {
  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <Sparkles size={25} scale={[4, 4, 4]} position={[0, 15, 0]} />
    </>
  );
};

export default BackgroundEffects;
