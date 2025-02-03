import React from "react";
import "../css/kubernetes.css";
import { SiKubernetes } from "react-icons/si";
import KubernetesModel from "./kubernetesModel";

export default function Kubernetes() {
  return (
    <>
      {/* <ParticleBackground /> */}

      <div className="relative  min-h-screen flex flex-col justify-center items-center text-white">
        {/* Title */}
        <h1 className="title fhd:text-[5rem] z-10 pt-10 text-[#4879e2] text-4xl md:text-6xl tracking-wider text-center">
          Kubernetes
        </h1>

        <div className="flex justify-center  flex-col items-center md:flex-row  md:justify-center md:items-center fhd:gap-14 lg:gap-10 md:gap-0 fhd:px-32 lg:px-10 xl:px-20 md:px-10 mt-10">
          <div className="flex order-1 flex-col md:flex-row md:order-2 justify-center px-10 w-full md:w-5/6 fhd:mt-16 md:mt-10 fhd:gap-16 lg:gap-5 md:gap-5 gap-28">
            <div
              className="card w-full md:p-6 lg:p-8 bg-[#9fabf7] rounded-lg border border-blue-500 shadow-[#50A8E1] shadow-xl fhd:min-h-[500px] lg:min-h-[400px] md:min-h-[auto] min-h-[300px]
 overflow-hidden"
            >
              <div>
              <SiKubernetes className=" text-[#4879e2] fhd:text-[110px] lg:text-[60px] md:text-[50px] text-6xl mx-auto" />
              <h2 className="text-xl fhd:text-3xl lg:text-lg md:text-sm  text-center font-bold mt-3">
                Session 3 <br /> Sailing to k8s
              </h2>
              </div>
              <p className="fhd:text-lg text-sm lg:text-sm md:text-[15px] text-justify mt-5">
              Running a few containers is simple, but scaling to hundreds? That’s where Kubernetes shines!  It auto-scales, load balances and self-heals containers, making it the go-to for managing large-scale applications.
In this session, we’ll break down Kubernetes architecture, explore its key components and compare Docker vs Kubernetes to see how they complement each other. By the end, you’ll know why Kubernetes powers the cloud!
              </p>
            </div>

            <div
              className="card w-full md:p-6 lg:p-8 bg-[#9fabf7] rounded-lg border border-blue-500 shadow-[#50A8E1] shadow-xlfhd:min-h-[500px] lg:min-h-[400px] md:min-h-[auto] min-h-[300px]
 overflow-hidden"
            >
              <div>
              <SiKubernetes className=" text-[#4879e2] fhd:text-[110px] lg:text-[60px] md:text-[50px] text-6xl mx-auto" />

              <h2 className="text-xl fhd:text-3xl lg:text-lg md:text-sm text-center font-bold mt-3">
                Session 4 <br /> Pod Power
              </h2>
                <div className="h-5"></div></div>
              <p className="fhd:text-lg text-sm lg:text-sm md:text-[15px] text-justify mt-5 ">
              Level up your Kubernetes skills! 🚀 Learn Pods, Services, Deployments and more to automate and scale applications seamlessly.
Go beyond theory with real-world projects, deploying and managing cloud-native apps like a pro.
For the grand finale—dive into epic wargames! 🔥 Test your skills, compete and push your Docker & K8s expertise to the limit! 🎯
              </p>
            </div>
          </div>
          <div className=" px-10 md:px-0 h-[400px] md:h-auto  w-full md:w-2/6 flex overflow-hidden flex-col items-center relative">
            {/* <img
              src="base1.png"
              alt="model base image"
              className="absolute  top-24 fhd:top-32 lg:top-20 md:top-40 pointer-events-none w-full max-w-[350px] md:max-w-[350px] fhd:max-w-[700px] lg:max-w-[375px] animate-flicker"
            /> */}
            <KubernetesModel className="cursor-pointer relative z-50" />
          </div>
        </div>
      </div>
    </>
  );
}
