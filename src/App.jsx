import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BallSimulation from "./components/ballsimulation";
import WASDGuidelines from "./components/Guidelines";
import RegisterPage from "./components/registerPage";
import PageLoader from "./components/Loader";
import MainPage from "./components/mainPage";
import BallRegbutton from "./components/ballpageRegbutton";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Wrap MainPage inside a component that handles the loader */}
        <Route path="/" element={<MainPageWithLoader />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/ball-simulation"
          element={
            <div>
              <BallSimulation />
              <WASDGuidelines />
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

// ✅ Wrap MainPage inside a component that shows the loader
const MainPageWithLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return loading ? <PageLoader /> : <MainPage />;
};

export default App;
