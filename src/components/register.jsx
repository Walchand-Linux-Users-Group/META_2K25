import React from "react";
import { InfoSection } from "./info-section";
import RegistrationForm from "./registration-form";

const Register = () => {
    return (
        <div className="font-main min-h-screen bg-slate-950 text-white flex justify-center items-center p-6 ">
            <div className="container grid lg:grid-cols-2 gap-12 justify-center items-center">
                <InfoSection />
                <RegistrationForm />
            </div>
        </div>
    );
};

export default Register;
