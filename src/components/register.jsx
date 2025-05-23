import React from "react";
import { InfoSection } from "./info-section";
import RegistrationForm from "./registration-form";
import Register_close from "./Register_close";

const Register = () => {
    return (
        <div className="font-main min-h-screen  text-white mt-32 md:mt-10 flex justify-center items-center p-6 ">
            <div className="container grid lg:grid-cols-2 gap-12 justify-center items-center">
                <InfoSection />
                {/* <RegistrationForm /> */}
                <Register_close/>
            </div>
        </div>
    );
};

export default Register;
