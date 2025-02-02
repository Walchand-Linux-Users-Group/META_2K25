import React, { useState, useEffect, useRef } from "react";

import Docker from "./docker"
import Kubernetes from "./kubernetes"
import "../css/register.css"
import ParticleBackground from "./particles"
import Register from "./register"
import Footer from "./Footer"

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      <ParticleBackground />
      <div className="relative z-10 space-y-20 py-4">
        <Docker />
        <Kubernetes />
        <Register />
        <Footer />
      </div>
    </div>
  )
}

