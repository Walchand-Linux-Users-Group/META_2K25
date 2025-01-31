import React from "react";
import DockerModel from "./dockerModel";
import "../css/docker.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Docker() {
  return (
    <>
      <div className="pt-24 lg:h-screen h-auto ">

      

        <h1 className="font-lilita uppercase text-white text-4xl md:text-6xl tracking-wider text-center">
          Docker
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center lg:mt-16 gap-10 px-5 md:px-20">
          <div className="lg:order-1 order-2 flex flex-col md:flex-row gap-10 md:gap-20 text-white w-full md:w-2/3">
            <div className="w-full md:w-1/2 p-5 lg:mt-0 mt-24 rounded-lg border-blue-500 border shadow-[#50A8E1] shadow-xl">
              <h1 className="font-lilita text-2xl md:text-3xl p-3 md:p-5 text-center font-thin">
                Session 1 <br /> Dock into Basics
              </h1>
              <p className="text-justify mt-3 md:mt-5 text-base md:text-lg">
                Still thinking of installing an entire operating system to run
                an application? Stop! Get ready to unlock the potential of
                Docker and revolutionize your development workflow! This session
                will provide you with the foundational knowledge you need to
                thrive in the world of containers. From mastering the art of
                Docker installation and setup to seamlessly managing Docker
                images and leveraging powerful registries, you'll emerge
                confident to tackle any containerization challenge head-on.
              </p>
            </div>

            <div className="w-full md:w-1/2 p-5 rounded-lg border-blue-500 border shadow-[#50A8E1] shadow-xl relative md:top-16">
              <h1 className="font-lilita text-2xl md:text-3xl p-3 md:p-5 text-center font-thin">
                Session 2 <br /> Containers' Harmony
              </h1>
              <p className="text-justify mt-3 md:mt-5 text-base md:text-lg">
                In this session we’ll direct our way towards the advanced Docker
                techniques! Ever wondered if we can connect multiple Docker
                containers and manage their dependency on each other? Prepare to
                be amazed as we explore Docker networking and compose
                techniques, unraveling the intricacies of container
                communication and collaboration within complex environments.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full md:w-1/2 flex justify-center items-center relative min-h-[50vh]">
            <img
              src="base.png"
              alt="model base image"
              className="absolute md:pt-24 pt-40 pointer-events-none lg:w-full max-w-[400px] md:max-w-[650px] animate-flicker"
            />
            <DockerModel className="cursor-pointer relative z-50" />
          </div>
        </div>
      </div>
    </>
  );
}
