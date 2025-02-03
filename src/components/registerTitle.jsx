import { useState, useEffect, useRef } from "react";
import "../css/mainPage.css";
import { useNavigate } from "react-router-dom";
import ThreeDScene from "./starfield";
import { FaArrowAltCircleDown } from "react-icons/fa";

export default function RegisterTitle() {
  return (
    <div
      className="flex flex-col justify-center md:justify-center items-center overflow-y-hidden w-screen min-h-screen text-center bg-transparent text-white relative"
      style={{ userSelect: "none" }}
    >
      {/* Logo */}
      <div className="bg-transparent flex flex-col justify-center items-center z-10 flex-1">
        <img
          src="white_logo_wlug.png"
          alt="wlug logo"
          className="md:w-40 w-20"
        />

        {/* Main Event Title */}
        <h1 className="title text-transparent bg-clip-text bg-gradient-to-r from-[#0abfba] via-[#0abfba] via-30% to-[#4879e2] font-bold lg:text-8xl 2xl:text-8xl md:text-5xl text-4xl tracking-widest text-center">
          metamorphosis <br />
          <span className="bg-clip-text bg-gradient-to-r from-[#0abfba] via-[#0abfba] via-20% to-[#4879e2]">
            2<span className="title">k</span>25
          </span>
        </h1>

       
      </div>

       {/* Scroll arrow */}
       <div className="flex flex-col justify-center items-center md:mb-10 mb-20 h-20 w-full z-50">
        <h1 className="title text-[#0abfba] md:text-xl text-lg">Scroll</h1>
        <FaArrowAltCircleDown className="text-[#0abfba] text-2xl bouncyArrow" />
      </div>

      
    </div>
  );
}

