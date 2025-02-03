import { useState, useEffect, useRef } from "react";
import "../css/mainPage.css";
import { useNavigate } from "react-router-dom";
import ThreeDScene from "./starfield";

export default function MainPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState(0);
  const [floatOffset, setFloatOffset] = useState(0);
  const [targetOffset, setTargetOffset] = useState(0);
  const [imageRotation, setImageRotation] = useState(0);
  const [tiltTimeout, setTiltTimeout] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 400, height: 300 });
  const [bigThrustersSize, setBigThrustersSize] = useState({ width: 95 });
  const [smallThrustersSize, setSmallThrustersSize] = useState({ width: 70 });
  const [mainThrusterSize, setMainThrusterSize] = useState({ width: 45 });
  const [starSpeed, setStarSpeed] = useState(0.2);
  const [starSize, setStarSize] = useState(0.15);

  const navigate = useNavigate();
  const shipWrapperRef = useRef(null);
  const shipRef = useRef(null);
  const soundRef = useRef(new Audio("/music/spaceship-passing-by.mp3"));

  useEffect(() => {
    // soundRef.current.play()

    const updateSizes = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let newImageWidth, newImageHeight;

      if (screenWidth < 640) {
        setStarSize(0.15);
        // Mobile
        newImageWidth = Math.min(screenWidth * 0.8, 300);
      } else if (screenWidth < 1024) {
        // Tablet
        newImageWidth = Math.min(screenWidth * 0.6, 400);
      } else {
        setStarSpeed(0.2);
        setStarSize(0.25);
        // Desktop

        newImageWidth = Math.min(screenWidth * 0.4, 500);
      }
      newImageHeight = newImageWidth * 0.75;

      setImageSize({ width: newImageWidth, height: newImageHeight });
      setBigThrustersSize({ width: newImageWidth * 0.24 });
      setSmallThrustersSize({ width: newImageWidth * 0.18 });
      setMainThrusterSize({ width: newImageWidth * 0.11 });
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
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

  const handleButtonClick = (val) => {
    // console.log("Btn clicked")
    if (!shipWrapperRef.current) return;
  
   
    soundRef.current.pause();
    soundRef.current.currentTime = 0;

    soundRef.current.play().catch((error) => {
      console.error("Audio play failed:", error);
    });

    
  
    setTimeout(() => {
      if (!shipWrapperRef.current) return;
      shipWrapperRef.current.style.animation = "none";
      void shipWrapperRef.current.offsetWidth;
      shipWrapperRef.current.classList.add("gofast");
    }, 2000);
  
    setTimeout(() => {
      val === 0 ? navigate("/ball-simulation") : navigate("/register");
    }, 3500);
  
    setTimeout(() => {
      if (!shipWrapperRef.current) return;
      shipWrapperRef.current.classList.add("rmPlane");
    }, 3000);
  
    setTimeout(() => {
      if (!shipWrapperRef.current) return;
      shipWrapperRef.current.classList.remove("gofast");
    }, 5000);
  };
  
 
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current.currentTime = 0;
      }
    };
  }, [navigate]);
  

  const handleButtonHover = () => {
    setIsHovered(true);
    if (shipRef.current) {
      shipRef.current.classList.add("bounceFast");
    }

    setStarSpeed(0.6); 
  };

  const handleButtonLeave = () => {
    setIsHovered(false);
    if (shipRef.current) {
      void shipRef.current.offsetWidth;
      shipRef.current.classList.remove("bounceFast");
    }
    setStarSpeed(0.1); 
  };

  const spaceShipStyle = {
    transform: `translate(${Math.min(
      Math.max(offset, -(window.innerWidth - imageSize.width) / 2),
      (window.innerWidth - imageSize.width) / 2
    )}px, 
    ${Math.min(
      Math.max(floatOffset, -(window.innerHeight - imageSize.height) / 2),
      (window.innerHeight - imageSize.height) / 2
    )}px) rotate(${imageRotation}deg)`,
    transition: "transform 3.0s ease-out, rotate 1.0s ease-out",
    position: "relative",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    MsUserSelect: "none",
    pointerEvents: "none",
   
    top: "10%",
    left: "0%",
    transformOrigin: "center center", 
  };

  return (
    <div
      className="flex flex-col justify-evenly md:justify-center w-screen md:h-screen h-screen text-center bg-transparent text-white relative"
      onMouseMove={handleMouseMove}
      style={{
        userSelect: "none",
        overflow: "hidden",
        height: "100vh", 
        position: "relative", 
      }}
    >
     
      <ThreeDScene
        speed={starSpeed}
        starSize={starSize}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      {/* Logo */}
      <div className="absolute top-0 right-0 mr-5 mt-5 lg:mt-0">
        <img
          src="wlug-purple-logo.png"
          alt="wlug logo"
          className="md:w-28 w-20"
        />
      </div>

      {/* Upper Content */}
      <div className="md:flex-1 bg-transparent flex flex-col justify-center items-center z-10 pt-10 md:h-full">
        {/* Title Section */}
        <div className="mb-4 text-center">
          <h1 className="text-sm title text-[#d696f1] lg:text-2xl md:text-2xl tracking-wide">
            Walchand Linux Users' Group
          </h1>
          <h3 className="lg:text-lg title text-[#d696f1] md:text-xl text-xs mt-2 tracking-wide">
            presents
          </h3>
        </div>

        {/* Main Event Title */}
        <h1 className="title text-transparent bg-clip-text bg-gradient-to-r from-[#d590f3] to-[#8a8eec] font-bold lg:text-6xl 2xl:text-8xl md:text-5xl text-4xl tracking-widest text-center md:mt-0 mt-5 mb-6">
          metamorphosis <br />
          <span className="bg-clip-text bg-gradient-to-r from-[#d590f3] to-[#8a8eec]">
            2<span className="title">k</span>25
          </span>
        </h1>

        <div className="flex flex-row md:gap-10 gap-5 md:-mt-5 lg:mt-0 mt-8 text-white/80 lg:h-1/6 justify-center items-center">
          <button
            className="font-lilita custom-button text-xs md:text-lg bg-black/0.5 backdrop-blur-sm title border-purple-500 border-[1px] p-2 rounded-2xl md:w-40 w-32"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onClick={() => handleButtonClick(0)}
          >
            Play Game
          </button>
          <button
            className="font-lilita custom-button text-xs md:text-lg bg-black/0.5 backdrop-blur-sm title border-purple-500 border-[1px] p-2 rounded-2xl md:w-40 w-32"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onClick={() => handleButtonClick(1)}
          >
            Register Now
          </button>
        </div>
      </div>

  
<div className="md:flex-1 flex h-1/4 justify-center md:items-center items-start relative z-20">
 
  <div ref={shipWrapperRef} style={spaceShipStyle}>
   
    <div
      className={`ship-bounce-container ${isHovered ? "bounceFast" : ""}`}
      style={{ position: "relative", display: "inline-block" }}
    >
      <img
        src="spaceship/Spaceship.png"
        alt="spaceship"
        width={imageSize.width}
        height={imageSize.height}
        style={{ userSelect: "none", pointerEvents: "none" }}
      />
      {/* Thrusters – absolutely positioned relative to the inner container */}
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
        className="fast-flicker"
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

    </div>
  );
}
