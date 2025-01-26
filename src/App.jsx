import React from "react";
import WASDGuidelines from "./components/Guidelines";
import BallSimulation from "./components/ballsimulation";
import SessionCards from "./components/SessionCard";

const App = () => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <WASDGuidelines />
      {/* <SessionCards /> */}
      <BallSimulation />
    </div>
  );
};

export default App;
