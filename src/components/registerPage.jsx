import React, { useState, useEffect, useRef } from "react";

    import Docker from "./docker";
    import ThreeDModel from "./docker";
import Kubernetes from "./kubernetes";
import "../css/register.css"
// import ParticleBackground from "./particles";



    export default function RegisterPage(){

      

        return(
            <>
            <div className="bg-[#000] ">

              {/* <ParticleBackground/> */}

                
                <Docker className=""/>
                <Kubernetes className=""/>

                
            

            </div>
            
            </>
        )
    }