import React from "react";
import DockerModel from "./dockerModel";
import "../css/docker.css";
import { FaDocker } from "react-icons/fa";


export default function Docker() {
  return (
    <>
      {/* <ParticleBackground /> */}

      <div className="relative min-h-screen flex flex-col items-center text-white">
        {/* Title */}
        <h1 className="title fhd:text-[5rem] z-10 pt-0  text-5xl text-[#0abfba] md:text-6xl tracking-wider text-center">
          Docker
        </h1>

        <div className="flex justify-center  flex-col items-center md:flex-row  md:justify-center md:items-center fhd:gap-14 lg:gap-10 md:gap-0 fhd:px-32 lg:px-10 xl:px-20 md:px-10">
          <div className="flex order-2 flex-col md:flex-row md:order-1 justify-center px-10 w-full md:w-5/6 fhd:mt-16 md:mt-10 fhd:gap-16 lg:gap-5 md:gap-5 gap-28">
          <div className="docker-card w-full md:p-6 lg:p-8 bg-[#0abfba] rounded-lg border border-[#0abfba] shadow-[#50A8E1] shadow-xl fhd:min-h-[500px] lg:min-h-[400px] md:min-h-[auto] min-h-[300px]
 overflow-hidden">

              <FaDocker className=" text-[#0abfba] fhd:text-[110px] lg:text-[60px] md:text-[50px] text-6xl mx-auto" />
              <h2 className="text-xl fhd:text-3xl lg:text-lg md:text-sm  md:mt-0 text-center font-bold mt-3">
                Session 1 <br /> Dock into Basics
              </h2>
              <p className="fhd:text-lg text-sm lg:text-xs md:text-[10px] text-justify mt-5">
              Still thinking of installing an entire operating system to run an application? Stop! Get ready to unlock the potential of Docker and revolutionize your development workflow! This session will provide you with the foundational knowledge you need to thrive in the world of containers. From mastering the art of Docker installation and setup to seamlessly managing Docker images and leveraging powerful registries, you'll emerge confident to tackle any containerization challenge head-on. In this session, we’ll dock into the basics of Docker!
              </p>
            </div>

            <div className="docker-card w-full md:p-6 lg:p-8 bg-[#0abfba] rounded-lg border border-[#0abfba] shadow-[#50A8E1] shadow-xlfhd:min-h-[500px] lg:min-h-[400px] md:min-h-[auto] min-h-[300px]
 overflow-hidden">

            <FaDocker className=" text-[#0abfba] fhd:text-[110px] lg:text-[60px] md:text-[50px] text-6xl mx-auto" />

              <h2 className="text-xl fhd:text-3xl lg:text-lg md:text-sm text-center font-bold mt-3">
                Session 2 <br /> Containers' Harmony
              </h2>
              <p className="fhd:text-lg text-sm lg:text-xs md:text-[10px] text-justify mt-5 ">
              Still thinking of installing an entire operating system to run an application? Stop! Get ready to unlock the potential of Docker and revolutionize your development workflow! This session will provide you with the foundational knowledge you need to thrive in the world of containers. From mastering the art of Docker installation and setup to seamlessly managing Docker images and leveraging powerful registries, you'll emerge confident to tackle any containerization challenge head-on. In this session, we’ll dock into the basics of Docker!
              </p>
            </div>
          </div>
          <div className="order-1 px-10 md:px-0 h-[500px] md:h-auto md:order-2 w-full md:w-2/6 flex overflow-hidden flex-col items-center relative">
            <img
              src="base.png"
              alt="model base image"
              className="absolute  top-24 fhd:top-32 lg:top-40 md:top-40 pointer-events-none w-full max-w-[350px] md:max-w-[350px] fhd:max-w-[700px] lg:max-w-[375px] animate-flicker"
            />
            <DockerModel className="cursor-pointer relative z-50" />
          </div>
        </div>
      </div>
    </>
  );
}
