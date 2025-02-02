import React from "react";
import "../css/docker.css";
import { FaDocker } from "react-icons/fa";
import "../css/infoSec.css"
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";

import { LiaDiscord } from "react-icons/lia";

export default function Footer() {
  return (
    <>
      {/* <div className="w-full h-20"></div> */}

      <div className="flex flex-wrap md:flex-nowrap justify-between items-center bg-[#111]/90 border border-[#4879e2] text-white mx-5 mb-10 rounded-lg backdrop-blur-sm p-5">
        <div className="flex flex-col md:flex-row w-full gap-5 md:gap-0 justify-between items-center md:px-10">
         
          <div className="flex flex-col md:flex-row items-center  md:gap-20">
            <div>
              <img src="white_logo_wlug.png" className="h-40 md:h-40 " alt="WLUG Logo" />
            </div>

            <div className="flex flex-col items-center md:gap-4 gap-8">
              <h1 className="font-lilita  text-2xl md:text-3xl font-medium tracking-wider text-center">
                Connect With Us
              </h1>

              <div className="flex space-x-4">
      {[
        { icon: FaGithub, href: "https://github.com/Walchand-Linux-Users-Group" },
        { icon: FaXTwitter, href: "https://mobile.twitter.com/wcewlug" },
        { icon: FaLinkedin, href: "https://www.linkedin.com/company/wlug-club/" },
        { icon: FaInstagram, href: "https://instagram.com/wcewlug?igshid=YmMyMTA2M2Y=" },
      ].map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 p-3 rounded-full bg-[#4879e2]/10 hover:bg-[#4879e2]/20 transition-colors group"
        >
          <social.icon className="text-[#4879e2] h-6 w-6 group-hover:text-[#0abfba]" />
        </a>
      ))}
    </div>

              <div>
                <h1 className="font-lilita font-thin text-sm text-center">
                  © 2024 WCEWLUG, ALL RIGHTS RESERVED
                </h1>
              </div>
            </div>
          </div>

      
          <div className="flex flex-col text-center justify-center gap-8 md:gap-5 items-center mt-5 md:mt-0">
            <div className="tracking-wider text-xl md:text-xl lg:text-2xl flex flex-wrap justify-center gap-6 md:gap-5">
              <a href="/"><h1 className="font-lilita cursor-pointer hover:text-[#4879e2]">Home</h1></a>
              <a href="https://www.wcewlug.org/"><h1 className="font-lilita cursor-pointer hover:text-[#4879e2]">About Us</h1></a>
              <a href="/"><h1 className="font-lilita cursor-pointer hover:text-[#4879e2]">Register</h1></a>
            </div>
            <div className="flex flex-wrap flex-col  md:flex-col lg:flex-row justify-center gap-3 text-sm md:text-sm  tracking-wider">
              <a href="https://github.com/Walchand-Linux-Users-Group/gitbook/blob/wiki/policies/privacy-policy.md" target="_blank"><h1 className="font-lilita font-thin cursor-pointer lg:border-r-2 lg:pr-3">Privacy Policy</h1></a>
              <a href="https://github.com/Walchand-Linux-Users-Group/gitbook/blob/wiki/policies/terms-and-conditions.md" target="_blank"><h1 className="font-lilita font-thin cursor-pointer lg:border-r-2 lg:px-3">Terms & Conditions</h1></a>
              <a href="https://github.com/Walchand-Linux-Users-Group/gitbook/blob/wiki/policies/cancellation-refund-policy.md" target="_blank"><h1 className="font-lilita font-thin cursor-pointer pl-3">Refund Policy</h1></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
