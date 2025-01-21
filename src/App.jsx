import React from "react";
import WASDGuidelines from "./components/Guidelines";
import BallSimulation from "./components/Ballsimulation.jsx";

const App = () => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <WASDGuidelines />
      <BallSimulation />
    </div>
  );
};

export default App;
