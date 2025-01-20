import React from "react";
import { Stars } from "@react-three/drei";

const EndlessStars = () => {
  return (
    <Stars
      radius={100} // Radius of the inner sphere where the stars are visible
      depth={50} // Depth of the outer sphere where stars start to fade
      count={5000} // Number of stars
      factor={4} // Size factor for the stars
      saturation={0} // Saturation of the stars colors
      fade // Fading effect for stars
    />
  );
};

export default EndlessStars;
