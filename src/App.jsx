import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BallSimulation from "./components/ballsimulation";
import WASDGuidelines from "./components/Guidelines";
import RegisterPage from "./components/registerPage";
import PageLoader from "./components/Loader";
import MainPage from "./components/mainPage";
import "./App.css";
import BallRegbutton from "./components/ballpageRegbutton";
// import JoystickComponent from "./components/Joystick";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/ball-simulation"
          element={
            <div className="ball-simulation-container position-fixed">
              <BallSimulation />
              <WASDGuidelines />
              {/* <JoystickComponent /> */}
              <div className="fullscreen-overlay">
                <BallRegbutton />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
