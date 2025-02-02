import React from "react";

const BallRegbutton = () => {
  const handleButtonClick = (val) => {
    setTimeout(() => {
      navigate("/register");
    }, 2000);
  };

  const handleButtonHover = () => {
    setIsHovered(true);
    setStarSpeed(0.4); // Increase star speed on hover
  };

  const handleButtonLeave = () => {
    setIsHovered(false);
    setStarSpeed(0.1); // Reset to normal speed when not hovered
  };

  <button
    className="font-lilita custom-button uppercase border-purple-500 border-[1px] p-3 rounded-2xl w-40"
    onMouseEnter={handleButtonHover}
    onMouseLeave={handleButtonLeave}
    onClick={() => handleButtonClick(1)}
  >
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    Register Now
  </button>;
};

export default BallRegbutton;
