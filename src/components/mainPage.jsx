import React, { useState, useEffect, useRef } from "react";
import "../css/mainPage.css";
import Particles from "react-tsparticles";
import { useNavigate } from "react-router-dom";
import ThreeDScene  from "./starfield";

export default function MainPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState(0);
  const [floatOffset, setFloatOffset] = useState(0);
  const [targetOffset, setTargetOffset] = useState(0);
  const [imageRotation, setImageRotation] = useState(0);
  const [tiltTimeout, setTiltTimeout] = useState(null);
  const imageWidth = 700;
  const imageHeight = 500;

  const [imageSize, setImageSize] = useState({ width: 700, height: 500 });
  const [bigThrustersSize, setbigThrustersSize] = useState({ width: 150 });
  const [smallThrustersSize, setsmallThrustersSize] = useState({ width: 120 });
  const [mainThrusterSize, setmainThrusterSize] = useState({ width: 80 });

  const navigate = useNavigate();

  useEffect(() => {
    const updateImageSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        setImageSize({ width: 350, height: 200 });
        setbigThrustersSize({ width: 80 });
        setsmallThrustersSize({ width: 60 });
        setmainThrusterSize({ width: 40 });
      } else if (screenWidth < 1024) {
        // Tablets
        setImageSize({ width: 550, height: 350 });
        setbigThrustersSize({ width: 120 });
        setsmallThrustersSize({ width: 90 });
        setmainThrusterSize({ width: 65 });
      } else {
        // Desktops
        setImageSize({ width: 400, height: 500 });
        setbigThrustersSize({ width: 95 });
        setsmallThrustersSize({ width: 70 });
        setmainThrusterSize({ width: 45 });
      }
    };

    updateImageSize();

    window.addEventListener("resize", updateImageSize);

    return () => window.removeEventListener("resize", updateImageSize);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const newOffset = ((clientX - screenWidth / 2) / (screenWidth / 2)) * 600;
    setTargetOffset(newOffset);

    if (clientX < screenWidth / 2) {
      applyTilt("left");
    } else {
      applyTilt("right");
    }
  };

  const applyTilt = (direction) => {
    const tiltAngle = direction === "left" ? -3 : 3;

    setImageRotation(tiltAngle);

    if (tiltTimeout) clearTimeout(tiltTimeout);

    const timeout = setTimeout(() => {
      setImageRotation(0);
    }, 2000);

    setTiltTimeout(timeout);
  };

  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setFloatOffset((prev) => {
        if (prev >= 25) direction = -1;
        if (prev <= -25) direction = 1;
        return prev + direction;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => {
        if (Math.abs(targetOffset - prevOffset) < 0.5) {
          return targetOffset;
        }
        return prevOffset + (targetOffset - prevOffset) * 0.1;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [targetOffset]);

  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 200; i++) {
        const size = Math.random() * 2 + 2;
        const duration = Math.random() * 3 + 1;
        starArray.push({
          id: i,
          size,
          left: Math.random() * 100,
          top: Math.random() * 100,
          duration,
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  const shipRef = useRef(null);
  let spaceShipStyle =
    window.innerWidth > 768
      ? {
          transform: `translate(${Math.min(
            Math.max(offset, -(window.innerWidth - imageWidth) / 2),
            (window.innerWidth - imageWidth) / 2
          )}px, 
                            ${Math.min(
                              Math.max(
                                floatOffset,
                                -(window.innerHeight - imageHeight) / 2
                              ),
                              (window.innerHeight - imageHeight) / 2
                            )}px)`,
          rotate: `${imageRotation}deg`,
          transition: "transform 3.0s ease-out, rotate 1.0s ease-out",
          position: "relative",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
          pointerEvents: "none",
        }
      : {
          position: "relative",
          animation: "bounce 5s ease-in-out infinite",
        };

  const handleButtonClick = (val) => {
    console.log("Btn clicked");

    if (shipRef.current) {
      shipRef.current.style.animation = "none";
      void shipRef.current.offsetWidth;

      shipRef.current.classList.add("gofast");
      console.log(shipRef.current.classList);

      setTimeout(() => {
        val == 0 ? navigate("/ball-simulation") : navigate("/register");
      }, 900);

      setTimeout(() => {
        shipRef.current.classList.remove("gofast");

        console.log("Animation removed");
      }, 1500);
    }
  };

  return (
    <div
      className="flex justify-center flex-col w-screen h-screen text-center bg-black text-white relative overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ userSelect: "none" }}
    >
      <ThreeDScene style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} /> {/* Add the 3D space game as a background */}

      {/* Background Animation */}
      {/* <div
        className="bg-animation absolute inset-0 -z-1"
        style={{ pointerEvents: "none" }}
      >
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
      </div> */}

      {/* Logo */}
      <div className="absolute top-0 right-0 mr-5 mt-5 lg:mt-2">
        <img src="wlug-purple-logo.png" alt="wlug logo" className="w-20" />
      </div>

      {/* Title Section */}
      <div className="z-50 uppercase relative">
        <h1 className="font-lilita text-xl text-[#a360c0] lg:text-xl md:text-2xl tracking-wide">
          Walchand Linux Users' Group
        </h1>
        <h3 className="font-lilita lg:text-lg text-[#a360c0] md:text-xl text-md mt-2 tracking-wide">
          presents
        </h3>
      </div>

      {/* Main Event Title */}
      <div>
        <h1 className="font-lilita relative z-50 uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#AD1DEB] to-[#6E72FC] font-medium mt-10 lg:text-6xl md:text-7xl text-4xl tracking-widest">
          Metamorphosis <br />
          2k25
        </h1>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-row mt-10 gap-4 justify-center items-center relative z-50">
        <button
          className="enter-btn text-gray-300 hover:bg-[#6E72FC] uppercase text-center lg:text-xs md:text-xl text-xs tracking-wider border-[1px] p-3 px-8 font-medium rounded-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => handleButtonClick(0)}
        >
          Play Game
        </button>
        <button
          className="enter-btn text-gray-300 hover:bg-[#AD1DEB] uppercase text-center lg:text-xs md:text-xl text-xs tracking-wider border-[1px] p-3 px-8 font-medium rounded-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => handleButtonClick(1)}
        >
          Register
        </button>
      </div>

      {/* Spaceship Section */}
      <div className="flex justify-center items-center lg:mt-20 md:mt-30 mt-20 relative z-40">
        <div style={spaceShipStyle} ref={shipRef}>
          <img
            src="spaceship/Spaceship.png"
            alt="spaceship"
            width={imageSize.width}
            height={imageSize.height}
            style={{ userSelect: "none", pointerEvents: "none" }}
          />
          {/* Thrusters */}
          <img
            src="spaceship/thrustersRight.png"
            alt="Thruster Right"
            className={`thruster-flicker ${isHovered ? "fast-flicker" : ""}`}
            style={{
              position: "absolute",
              top: "25%",
              left: "54%",
              userSelect: "none",
              pointerEvents: "none",
            }}
            width={bigThrustersSize.width}
          />
          <img
            src="spaceship/thrustersLeft.png"
            alt="Thruster Left"
            className={`thruster-flicker ${isHovered ? "fast-flicker" : ""}`}
            style={{
              position: "absolute",
              top: "25%",
              right: "54%",
              userSelect: "none",
              pointerEvents: "none",
            }}
            width={bigThrustersSize.width}
          />
          <img
            src="spaceship/smallThrusterLeft.png"
            alt="Small Thruster Left"
            className={`thruster-flicker ${isHovered ? "fast-flicker" : ""}`}
            style={{
              position: "absolute",
              bottom: "15%",
              left: "11%",
              userSelect: "none",
              pointerEvents: "none",
            }}
            width={smallThrustersSize.width}
          />
          <img
            src="spaceship/smallThrusterRight.png"
            alt="Small Thruster Right"
            className={`thruster-flicker ${isHovered ? "fast-flicker" : ""}`}
            style={{
              position: "absolute",
              bottom: "15%",
              right: "11%",
              userSelect: "none",
              pointerEvents: "none",
            }}
            width={smallThrustersSize.width}
          />
          <img
            src="spaceship/redThruster.png"
            alt="red Thruster"
            className={`fast-flicker`}
            style={{
              position: "absolute",
              bottom: "55%",
              right: "44%",
              userSelect: "none",
              pointerEvents: "none",
            }}
            width={mainThrusterSize.width}
          />
        </div>
      </div>
    </div>
  );
}
