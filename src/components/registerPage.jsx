import React, { useState, useEffect, useRef } from "react";

    import Docker from "./docker";
    import ThreeDModel from "./docker";
import Kubernetes from "./kubernetes";
import "../css/register.css"
<<<<<<< HEAD
import ParticleBackground from "./particles";
import Register from "./register";
import  Footer  from "./Footer";

export default function RegisterPage() {
    return (
        <>
            <div className="bg-[#000] relative h-full  overflow-x-hidden overflow-y-auto space-y-20 py-4">
                <ParticleBackground />
                <Docker />
                <Kubernetes />
                <Register />
                <Footer className="z-10" />
            </div>
        </>
    );
=======
import ParticleBackground from "./particles"
import Register from "./register"
import Footer from "./Footer"
import RegisterTitle from "./registerTitle";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      <ParticleBackground  />
      <div className="relative z-10 space-y-20 py-4">
        <RegisterTitle/>
        <Docker />
        <Kubernetes />
        <Register />
        <Footer />
      </div>
    </div>
  )
>>>>>>> 4ffe48976a246b7f3d8dfa67c8fab167439c3d17
}
