import React, { useState, useEffect, useRef } from "react";

    import Docker from "./docker";
    import ThreeDModel from "./docker";
import Kubernetes from "./kubernetes";
import "../css/register.css"
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
}
