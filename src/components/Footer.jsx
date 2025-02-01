import React from "react";
import DockerModel from "./dockerModel";
import "../css/docker.css";
import { FaDocker } from "react-icons/fa";


export default function Footer() {
  return (
    <>
     

      <div className="relative justify-between min-h-28 flex items-center bg-[#111]/60 border-[1px] border-[#4879e2] text-white mx-5 mb-10 rounded-lg backdrop-blur-sm">
       <div className="px-10 py-2">
       <div className="">
        <img src="wlug-purple-logo.png" className="h-40"></img>
        </div>
       </div>
      </div>
    </>
  );
}
