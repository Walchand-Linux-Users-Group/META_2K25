"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Github, Instagram, Linkedin, Loader2, Twitter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
    collegeName: z
        .string()
        .min(2, "College name must be at least 2 characters."),
    yearOfStudy: z.number().int().min(1).max(4),
    dualBoot: z.boolean(),
});

const paymentSchema = z.object({
    transactionId: z
        .string()
        .min(5, "Transaction ID must be at least 5 characters."),
    transactionImage: z
        .instanceof(File)
        .refine((file) => file.size <= 5000000, "Max file size is 5MB."),
});

export default function RegistrationForm() {
    const [formState, setFormState] = useState({
        numOfParticipants: 1,
        participants: [
            {
                name: "",
                email: "",
                phone: "",
                collegeName: "",
                yearOfStudy: 1,
                dualBoot: false,
            },
        ],
        currentStep: 0,
        totalAmount: 0,
        payment: {},
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleParticipantChange = (value) => {
        const count = Number(value);
        setFormState((prev) => ({
            ...prev,
            numOfParticipants: count,
            participants: Array(count)
                .fill({})
                .map(
                    (_, i) =>
                        prev.participants[i] || {
                            name: "",
                            email: "",
                            phone: "",
                            collegeName: "",
                            yearOfStudy: 1,
                            dualBoot: false,
                        }
                ),
        }));
    };

    const validateStep = () => {
        if (formState.currentStep <= formState.numOfParticipants) {
            const currentUser =
                formState.participants[formState.currentStep - 1];
            try {
                userSchema.parse(currentUser);
                setErrors({});
                return true;
            } catch (e) {
                if (e instanceof z.ZodError) {
                    const fieldErrors = e.errors.reduce((acc, error) => {
                        acc[error.path[0]] = error.message;
                        return acc;
                    }, {});
                    setErrors(fieldErrors);
                }
                return false;
            }
        } else if (formState.currentStep === formState.numOfParticipants + 2) {
            try {
                paymentSchema.parse(formState.payment);
                setErrors({});
                return true;
            } catch (e) {
                if (e instanceof z.ZodError) {
                    const fieldErrors = e.errors.reduce((acc, error) => {
                        acc[error.path[0]] = error.message;
                        return acc;
                    }, {});
                    setErrors(fieldErrors);
                }
                return false;
            }
        }
        return true;
    };

    const updateParticipant = (index, field, value) => {
        setFormState((prev) => ({
            ...prev,
            participants: prev.participants.map((participant, i) =>
                i === index ? { ...participant, [field]: value } : participant
            ),
        }));
    };

    const updatePayment = (field, value) => {
        setFormState((prev) => ({
            ...prev,
            payment: { ...prev.payment, [field]: value },
        }));
    };

    const nextStep = () => {
        if (formState.currentStep === 0 || validateStep()) {
            setFormState((prev) => ({
                ...prev,
                currentStep: prev.currentStep + 1,
            }));
        }
    };

    const prevStep = () => {
        setFormState((prev) => ({
            ...prev,
            currentStep: prev.currentStep - 1,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep()) {
            setIsSubmitting(true);
            try {
                const formData = new FormData();
                formData.append(
                    "participants",
                    JSON.stringify(formState.participants)
                );
                formData.append(
                    "transactionId",
                    formState.payment.transactionId
                );
                formData.append(
                    "totalAmount",
                    formState.totalAmount.toString()
                );
                formData.append(
                    "transactionImage",
                    formState.payment.transactionImage
                );

                const response = await fetch(
                    "https://metabackend-6ood.onrender.com/register",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error("Registration failed");
                }

                const result = await response.json();
                console.log("Registration successful:", result);

                // Show success message
                await Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: "Thank you for registering for the event.",
                    confirmButtonColor: "#6366f1",
                });

                setFormState({
                    numOfParticipants: 1,
                    participants: [],
                    currentStep: 0,
                    totalAmount: 0,
                    payment: {},
                }); // Reset form
            } catch (error) {
                console.error("Registration error:", error);

                // Show error message
                await Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: "There was an error processing your registration. Please try again.",
                    confirmButtonColor: "#6366f1",
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    const totalSteps = formState.numOfParticipants + 3; // Participant forms + Review + Payment + Submit
    const isLastStep = formState.currentStep === totalSteps - 1;
    const isFirstStep = formState.currentStep === 0;
    const progress = isFirstStep
        ? 0
        : (formState.currentStep / (totalSteps - 1)) * 100;

    const paymentQRCode = "https://example.com/payment"; // Replace with actual payment link

    return (
        <div className="w-full max-w-2xl">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-3xl -z-10" />
                <div className="lg:min-h-[80vh] flex flex-col justify-center bg-background/80 backdrop-blur-xl rounded-2xl p-4 lg:p-8 shadow-2xl purple-glow">
                    <div className="mb-6">
                        <Progress value={progress} className="h-1" />
                    </div>

                    <AnimatePresence mode="wait">
                        {isFirstStep ? (
                            <motion.div
                                key="participant-select"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        How many are joining?
                                    </h2>
                                    <p className="text-slate-400">
                                        Select the number of team members
                                        participating in the event
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="participants">
                                        Number of Participants
                                    </Label>
                                    <Select
                                        value={formState.numOfParticipants.toString()}
                                        onValueChange={handleParticipantChange}
                                    >
                                        <SelectTrigger className="bg-background/50 border-purple-500/20">
                                            <SelectValue placeholder="Select participants" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <SelectItem
                                                    key={num}
                                                    value={num.toString()}
                                                >
                                                    {num}{" "}
                                                    {num === 1
                                                        ? "Participant"
                                                        : "Participants"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </motion.div>
                        ) : formState.currentStep <=
                          formState.numOfParticipants ? (
                            <motion.div
                                key={`participant-${formState.currentStep}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Participant {formState.currentStep} Details
                                </h2>
                                {[
                                    {
                                        field: "name",
                                        label: "Name",
                                        type: "text",
                                    },
                                    {
                                        field: "email",
                                        label: "Email",
                                        type: "email",
                                    },
                                    {
                                        field: "phone",
                                        label: "Phone",
                                        type: "tel",
                                    },
                                    {
                                        field: "collegeName",
                                        label: "College Name",
                                        type: "text",
                                    },
                                ].map((field) => (
                                    <div
                                        key={field.field}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor={field.field}>
                                            {field.label}
                                        </Label>
                                        <Input
                                            id={field.field}
                                            type={field.type}
                                            value={
                                                formState.participants[
                                                    formState.currentStep - 1
                                                ][field.field]
                                            }
                                            onChange={(e) =>
                                                updateParticipant(
                                                    formState.currentStep - 1,
                                                    field.field,
                                                    e.target.value
                                                )
                                            }
                                            className="bg-background/50 border-purple-500/20"
                                        />
                                        {errors[field.field] && (
                                            <p className="text-red-500">
                                                {errors[field.field]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <Label htmlFor="yearOfStudy">
                                        Year of Study
                                    </Label>
                                    <Select
                                        value={formState.participants[
                                            formState.currentStep - 1
                                        ].yearOfStudy.toString()}
                                        onValueChange={(value) =>
                                            updateParticipant(
                                                formState.currentStep - 1,
                                                "yearOfStudy",
                                                Number(value)
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-background/50 border-purple-500/20">
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4].map((year) => (
                                                <SelectItem
                                                    key={year}
                                                    value={year.toString()}
                                                >
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.yearOfStudy && (
                                        <p className="text-red-500">
                                            {errors.yearOfStudy}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dualBoot"
                                        checked={
                                            formState.participants[
                                                formState.currentStep - 1
                                            ].dualBoot
                                        }
                                        onCheckedChange={(checked) =>
                                            updateParticipant(
                                                formState.currentStep - 1,
                                                "dualBoot",
                                                checked
                                            )
                                        }
                                    />
                                    <Label htmlFor="dualBoot">
                                        Do you have a dual-booted laptop?
                                    </Label>
                                </div>
                            </motion.div>
                        ) : formState.currentStep ===
                          formState.numOfParticipants + 1 ? (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6 max-h-[80vh]"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Review & Confirm
                                </h2>
                                <div className="space-y-4 max-h-[60vh] overflow-auto">
                                    {formState.participants.map(
                                        (participant, index) => (
                                            <div
                                                key={index}
                                                className="p-4 gradient-border space-y-2"
                                            >
                                                <h3 className="font-semibold text-white">
                                                    Participant {index + 1}
                                                </h3>
                                                <p>Name: {participant.name}</p>
                                                <p>
                                                    Email: {participant.email}
                                                </p>
                                                <p>
                                                    Phone: {participant.phone}
                                                </p>
                                                <p>
                                                    College:{" "}
                                                    {participant.collegeName}
                                                </p>
                                                <p>
                                                    Year of Study:{" "}
                                                    {participant.yearOfStudy}
                                                </p>
                                                <p>
                                                    Dual-booted Laptop:{" "}
                                                    {participant.dualBoot
                                                        ? "Yes"
                                                        : "No"}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Payment Details
                                </h2>
                                <div className="flex justify-center mb-4">
                                    <QRCode value={paymentQRCode} size={200} />
                                </div>
                                <p className="text-center text-white mb-4">
                                    Scan the QR code to make the payment
                                </p>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="transactionId">
                                            Transaction ID
                                        </Label>
                                        <Input
                                            id="transactionId"
                                            value={
                                                formState.payment
                                                    .transactionId || ""
                                            }
                                            onChange={(e) =>
                                                updatePayment(
                                                    "transactionId",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-background/50 border-purple-500/20"
                                        />
                                        {errors.transactionId && (
                                            <p className="text-red-500">
                                                {errors.transactionId}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="transactionImage">
                                            Payment Screenshot
                                        </Label>
                                        <Input
                                            id="transactionImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                updatePayment(
                                                    "transactionImage",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                            className="bg-background/50 border-purple-500/20"
                                        />
                                        {errors.transactionImage && (
                                            <p className="text-red-500">
                                                {errors.transactionImage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between mt-8">
                        {!isFirstStep && (
                            <Button
                                onClick={prevStep}
                                className="bg-background/50 border-purple-500/20 hover:bg-purple-500/10"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                        )}
                        {isLastStep ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Complete Registration"
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={nextStep}
                                className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <motion.div
                className="mt-24 flex flex-col justify-center items-center  border-purple-500/20  lg:hidden"
            >
                <p className="text-white mb-4 font-semibold">
                    Connect with us:
                </p>
                <div className="flex space-x-4">
                    {[
                        {
                            icon: Github,
                            href: "https://github.com/Walchand-Linux-Users-Group",
                        },
                        {
                            icon: Twitter,
                            href: "https://mobile.twitter.com/wcewlug",
                        },
                        {
                            icon: Linkedin,
                            href: "https://www.linkedin.com/company/wlug-club/",
                        },
                        {
                            icon: Instagram,
                            href: "https://instagram.com/wcewlug?igshid=YmMyMTA2M2Y=",
                        },
                        {
                            icon: ({ className }) => (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 -28.5 256 256"
                                    version="1.1"
                                    preserveAspectRatio="xMidYMid"
                                    className={className}
                                >
                                    <g>
                                        <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"></path>
                                    </g>
                                </svg>
                            ),
                            href: "https://discord.com/invite/3ce8hBZfc8",
                        },
                    ].map((social, index) => (
                        <a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 p-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors group"
                        >
                            <social.icon className="text-purple-500 group-hover:text-purple-400" />
                        </a>
                    ))}
                </div>

                <p className="text-[14px] text-white mt-6">
                    © 2025 WCEWLUG, ALL RIGHTS RESERVED
                </p>
            </motion.div>
        </div>
    );
}
