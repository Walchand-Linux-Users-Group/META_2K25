import React, { useState, useEffect } from "react";
import "./Loader.css"; // Assuming you have the same CSS file
import ThreeDScene from "./starfield";

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time (replace with actual loading logic if needed)
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the loader after 3 seconds
    }, 3000); // Example: 3 seconds loading time

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Conditionally render loader or null when loading is done
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="vertical-centered-box">
          <div className="content">
            <div className="loader-circle"></div>
            <div className="loader-line-mask">
              <div className="loader-line"></div>
            </div>
            <img src="/Meta.png" alt="Loading" width="120px" height="120px" />
          </div>
          <div className="bg-animation">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            <div id="stars4"></div>
          </div>
        </div>
      </div>
    );
  }

  return null; // Return nothing once the loading is complete
};

export default PageLoader;
