import React, { useState, useEffect } from "react";
import Docker from "./docker";
import Kubernetes from "./kubernetes";
import "../css/register.css";
import ParticleBackground from "./particles";
import Register from "./register";
import Footer from "./Footer";
import RegisterTitle from "./registerTitle";

export default function RegisterPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the page is already loaded when the component mounts
    if (document.readyState === "complete") {
      setLoading(false); // If already loaded, hide the loader
      return;
    }

    // Define the window load handler for when all resources are loaded
    const handleWindowLoad = () => {
      setLoading(false); // Hide loader after everything is loaded
    };

    // Adding event listener for when all resources (images, scripts) have loaded
    window.addEventListener("load", handleWindowLoad);

    // Fallback: Set a timeout to hide the loader after a certain time
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds fallback

    // Cleanup the event listener and timeout when the component unmounts
    return () => {
      window.removeEventListener("load", handleWindowLoad);
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array, runs only once

  if (loading) {
    // Show the loader while loading
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

  // When loading is false, display the main content
  return (
    <div className="bg-[#000] relative h-full overflow-x-hidden overflow-y-auto py-1 transition-opacity duration-500 opacity-100">
      <RegisterTitle />
      <ParticleBackground />
      <Docker />
      <Kubernetes />
      <Register />
      <Footer className="z-10" />
    </div>
  );
}
