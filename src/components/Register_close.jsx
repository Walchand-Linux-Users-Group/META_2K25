"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";
import { CustomNumberInput } from "@/components/ui/custom-number-input";
import "../css/infoSec.css";
import Qr1 from "../assets/qr1.jpeg";
import Qr2 from "../assets/qr2.jpeg";
import Qr3 from "../assets/qr3.jpeg";

export default function Register_close() {
  return (
    <div className="w-full max-w-2xl rounded-lg my-12">
      <div className="relative">
        <div className="lg:min-h-[80vh] border-[#4879e2] border-[1px] backdrop-blur-sm bg-black/30 flex flex-col justify-center rounded-2xl p-8 lg:p-8 shadow-2xl purple-glow">
          <div className="title text-4xl font-bold text-center py-10 md:p-5">
            <div className="Text">
              <h1 className="title">Registration</h1>
              <h1 className="title">Closed</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
