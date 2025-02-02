import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import BallSimulation from "./components/ballsimulation";
import WASDGuidelines from "./components/Guidelines";
import RegisterPage from "./components/registerPage";
import PageLoader from "./components/Loader";
import MainPage from "./components/mainPage";
import "./App.css"; // Import the CSS file
import BallRegbutton from "./components/ballpageRegbutton";
// import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/ball-simulation"
          element={
            <div>
              <BallSimulationWrapper />
              <WASDGuidelines />
              <div className="fullscreen-overlay ">
                <BallRegbutton />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // This hook must be used inside the Router context

  useEffect(() => {
    // Simulate loading time, e.g., fetching data
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 1 second
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Delay the navigation slightly to show the transition
      const timer = setTimeout(() => {
        // navigate("/main"); // Redirect to main page after loading
      }, 1000);

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [isLoading, navigate]);

  return (
    <div>
      {isLoading ? (
        <div className="fade-in show">
          <PageLoader />
        </div>
      ) : (
        <div>
          <MainPage />
          <BallRegbutton />
        </div>
      )}
    </div>
  );
};

// Wrapper component to handle navigation for BallSimulation
const BallSimulationWrapper = () => {
  const navigate = useNavigate();

  const navigateToNextPage = () => {
    navigate("/register");
  };

  return <BallSimulation navigateToNextPage={navigateToNextPage} />;
};

export default App;
  