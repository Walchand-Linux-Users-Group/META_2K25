import { useState, useEffect, useRef } from "react";
import "../css/mainPage.css";
import { useNavigate } from "react-router-dom";
import ThreeDScene from "./starfield";
import { FaArrowAltCircleDown } from "react-icons/fa";

export default function RegisterTitle() {
  return (
    <div
      className="flex flex-col justify-evenly md:justify-center overflow-y-hidden w-screen md:h-screen h-screen text-center bg-transparent text-white relative"
      style={{ userSelect: "none" }}
    >
      {/* Logo */}
      <div className="md:flex-1 bg-transparent flex flex-col justify-center items-center z-10 md:h-full">
        <div className="">
          <img
            src="white_logo_wlug.png"
            alt="wlug logo"
            className="md:w-40 w-20"
          />
        </div>
        {/* Main Event Title */}
        <h1 className="title text-transparent md:-mt-10 bg-clip-text bg-gradient-to-r from-[#0abfba] via-[#0abfba] via-30% to-[#4879e2] font-bold lg:text-8xl 2xl:text-8xl md:text-5xl text-4xl tracking-widest text-center">
          metamorphosis <br />
          <span className="bg-clip-text bg-gradient-to-r from-[#0abfba] via-[#0abfba] via-20% to-[#4879e2]">
            2<span className="title">k</span>25
          </span>
        </h1>
      </div>

      {/* Scroll arrow */}
      <div className="flex flex-col gap-5 sm:gap-4 justify-center items-center absolute sm:bottom-10 bottom-10 w-full z-50">
        <h1 className="title text-[#0abfba] text-xl">Scroll</h1>
        <FaArrowAltCircleDown className="text-[#0abfba] text-2xl animate-bounce" />
      </div>
    </div>
  );
}
