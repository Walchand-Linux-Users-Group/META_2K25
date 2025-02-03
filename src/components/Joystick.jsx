import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const JoystickComponent = () => {
  const location = useLocation();

  useEffect(() => {
    // Function to setup the joystick
    const setupJoystick = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobile = /android|iPad|iPhone|iPod/i.test(userAgent);

      if (!isMobile || location.pathname !== "/ball-simulation") {
        return;
      }

      const joystick = document.createElement("div");
      joystick.style.position = "absolute";
      joystick.style.bottom = "15%";
      joystick.style.left = "50%";
      joystick.style.width = "150px";
      joystick.style.height = "150px";
      joystick.style.border = "2px solid #aaa";
      joystick.style.borderRadius = "50%";
      joystick.style.background = "rgba(255, 255, 255, 0.5)";
      joystick.style.zIndex = "1000";
      joystick.style.opacity = "0.3";
      joystick.style.touchAction = "none";
      joystick.style.transform = "translateX(-50%)";
      document.body.appendChild(joystick);

      const handle = document.createElement("div");
      handle.style.position = "absolute";
      handle.style.width = "50px";
      handle.style.height = "50px";
      handle.style.opacity = "0.4";
      handle.style.background = "rgba(0, 0, 0, 0.7)";
      handle.style.borderRadius = "50%";
      handle.style.left = "50%";
      handle.style.top = "50%";
      handle.style.transform = "translate(-50%, -50%)";
      joystick.appendChild(handle);

      let initialTouch = null;
      let isJoystickActive = false;
      const joystickPosition = { x: 0, y: 0 };

      const handleTouchStart = (event) => {
        isJoystickActive = true;
        initialTouch = event.touches[0];
      };

      const handleTouchMove = (event) => {
        if (!isJoystickActive) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - initialTouch.clientX;
        const deltaY = touch.clientY - initialTouch.clientY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 50;
        const angle = Math.atan2(deltaY, deltaX);

        const clampedDistance = Math.min(distance, maxDistance);
        const x = clampedDistance * Math.cos(angle);
        const y = clampedDistance * Math.sin(angle);

        joystickPosition.x = x / maxDistance;
        joystickPosition.y = y / maxDistance;

        handle.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
      };

      const handleTouchEnd = () => {
        isJoystickActive = false;
        joystickPosition.x = 0;
        joystickPosition.y = 0;
        handle.style.transform = "translate(-50%, -50%)";
      };

      joystick.addEventListener("touchstart", handleTouchStart);
      joystick.addEventListener("touchmove", handleTouchMove);
      joystick.addEventListener("touchend", handleTouchEnd);

      // Cleanup function to remove the event listeners and the joystick element
      return () => {
        joystick.removeEventListener("touchstart", handleTouchStart);
        joystick.removeEventListener("touchmove", handleTouchMove);
        joystick.removeEventListener("touchend", handleTouchEnd);
        document.body.removeChild(joystick);
      };
    };

    // Setup joystick
    const cleanup = setupJoystick();

    // Cleanup joystick when component unmounts or path changes
    return () => {
      if (cleanup) cleanup();
    };
  }, [location.pathname]);

  return null; // This component does not render anything
};

export default JoystickComponent;
