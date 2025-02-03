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
        totalAmount: 349,
        payment: {},
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [qrCode, setQrCode] = useState(Qr1);

    const handleParticipantChange = (value) => {
        const count = Number(value);
        setFormState((prev) => ({
            ...prev,
            totalAmount: count == 1 ? 349 : count * 299,
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
        setQrCode(count == 1 ? Qr1 : count == 2 ? Qr2 : Qr3);
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
                    totalAmount: 349,
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

    return (
        <div className="w-full max-w-2xl  rounded-lg">
            <div className="relative">
                <div className="absolute" />
                <div className="lg:min-h-[80vh] border-[#4879e2] border-[1px] backdrop-blur-sm bg-black/3 flex flex-col justify-center rounded-2xl p-8 lg:p-8 shadow-2xl purple-glow">
                    <div className="title text-3xl font-bold text-center py-10 md:p-5">
                        {" "}
                        <h1 className="title">Registration</h1>
                    </div>
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
                                    <h2 className="text-2xl py-5 font-bold text-white mb-2">
                                        How many are joining?
                                    </h2>
                                    <p className="text-slate-400">
                                        Select the number of team members
                                        participating in the event.
                                    </p>
                                </div>
                                <div className="space-y-2 pt-8">
                                    <Label htmlFor="participants">
                                        Number of Participants
                                    </Label>
                                    <CustomNumberInput
                                        value={formState.numOfParticipants}
                                        onChange={(value) =>
                                            handleParticipantChange(value)
                                        }
                                        min={1}
                                        max={3}
                                    />
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
                                <h2 className="text-2xl font-bold  text-white mb-2">
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
                                            className="bg-background/50 border-[#4879e2]"
                                        />
                                        {errors[field.field] && (
                                            <p className="text-red-500 text-xs">
                                                {errors[field.field]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <Label htmlFor="yearOfStudy">
                                        Year of Study
                                    </Label>
                                    <RadioGroup
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
                                        className="flex space-x-4"
                                    >
                                        {[1, 2, 3, 4].map((year) => (
                                            <div
                                                key={year}
                                                className="flex items-center space-x-2"
                                            >
                                                <RadioGroupItem
                                                    value={year.toString()}
                                                    id={`year-${year}`}
                                                    className="border-[#4879e2]"
                                                />
                                                <Label htmlFor={`year-${year}`}>
                                                    {year}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors.yearOfStudy && (
                                        <p className="text-red-500 text-xs">
                                            {errors.yearOfStudy}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dualBoot"
                                        className="border-[#4879e2] "
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
                                    <img src={qrCode} alt="QR Code" className="h-[300px]"/>
                                </div>
                                <p className="text-center text-white mb-2">
                                    Scan the QR code to make the payment
                                </p>
                                <p className="text-center text-white mb-4 font-semibold">
                                    {" "}
                                    ₹ {formState.totalAmount}
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
                                            className="bg-background/50 border-[#4879e2]"
                                        />
                                        {errors.transactionId && (
                                            <p className="text-red-500 text-xs">
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
                                            className="bg-background/50 border-[#4879e2]"
                                        />
                                        {errors.transactionImage && (
                                            <p className="text-red-500 text-xs">
                                                {errors.transactionImage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between mt-12">
                        {!isFirstStep && (
                            <Button
                                onClick={prevStep}
                                className="bg-background/50 border-[#4879e2] hover:bg-[#4879e2]"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                        )}
                        {isLastStep ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="ml-auto bg-gradient-to-r from-[#4879e2] to-[#0aaabf] hover:from-[#1a4196] hover:to-[#0aaabf]"
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
                                className="ml-auto bg-gradient-to-r from-[#4879e2] to-[#0aaabf] hover:from-[#1a4196] hover:to-[#0aaabf]"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
