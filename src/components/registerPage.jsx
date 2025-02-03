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
   
    if (document.readyState === "complete") {
      setLoading(false); 
      return;
    }

   
    const handleWindowLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };


    window.addEventListener("load", handleWindowLoad);

 
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); 

  
    return () => {
      window.removeEventListener("load", handleWindowLoad);
      clearTimeout(timeoutId);
    };
  }, []); 

  if (loading) {
   
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
