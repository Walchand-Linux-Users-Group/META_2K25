import React, { useState, useEffect, useRef } from "react";

    import Docker from "./docker";
    import ThreeDModel from "./docker";
import Kubernetes from "./kubernetes";
import "../css/register.css"
import ParticleBackground from "./particles";
import Register from "./register";
import { InfoSection } from "./info-section";
import  Footer  from "./Footer";
import { motion, AnimatePresence } from "framer-motion"

export default function RegisterPage() {
    return (
        <>
            <div className="bg-[#000] relative min-h-screen overflow-x-hidden overflow-y-auto">
                <ParticleBackground />

                <Docker />
                <div className="h-16 lg:h-0"></div>
                <Kubernetes />
                <Register />
                <Footer className="z-10" />
            </div>
        </>
    );
}
