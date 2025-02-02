import React, { useState, useEffect, useRef } from "react";

import Docker from "./docker";
import ThreeDModel from "./docker";
import Kubernetes from "./kubernetes";
<<<<<<< HEAD
import "../css/register.css"
import ParticleBackground from "./particles"
import Register from "./register"
import Footer from "./Footer"
=======
import "../css/register.css";
import ParticleBackground from "./particles";
import Register from "./register";
import Footer from "./Footer";
>>>>>>> 2f1cd280af5786dbf9fc9e05d6564137e52e9103
import RegisterTitle from "./registerTitle";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      <ParticleBackground />
      <div className="relative z-10 space-y-20 py-4">
        <RegisterTitle />
        <Docker />
        <Kubernetes />
        <Register />
        <Footer />
      </div>
    </div>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> 2f1cd280af5786dbf9fc9e05d6564137e52e9103
}
