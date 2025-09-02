"use client";
import React, { useState } from "react";
import Header from "@/components/general/header menu/Header";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import { Input, Textarea } from "@/features/forms/components/FormComponents";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logError from "@/common/logError";

const contactFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    message: z.string().min(1, { message: "Message is required" }),
});

type ContactFormType = z.infer<typeof contactFormSchema>;

const ContactUs = () => {
    const t = useDictionary();
    const [isLoading, setIsLoading] = useState(false);
    const [isTemporarilyUnavailable] = useState(true); // Easy to toggle by changing this to false
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ContactFormType>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormType) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/email/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            // Handle success (e.g., show success message, reset form)
        } catch (error) {
            logError(error, { data }, "contact-form");
            // Handle error (e.g., show error message)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="flex bg-slate-300 min-h-[90svh] flex-col items-center justify-start p-[5%] md:p-[10%]">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold mb-6 text-center">{t.contactUs.title}</h1>

                    {isTemporarilyUnavailable ? (
                        <div className="text-center">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-lg text-yellow-700">Please be aware that our team is currently out of the office and will be back on October 6th, 2025.</p>
                                        <p className="mt-3 text-sm text-yellow-600">We appreciate your patience and look forward to assisting you upon our return.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-lg text-gray-600 mb-8">{t.contactUs.subtitle}</p>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Input label={t.contactUs.name} register={register("name")} error={errors.name} required />
                                </div>
                                <div>
                                    <Input label={t.contactUs.email} register={register("email")} error={errors.email} required />
                                </div>
                                <div>
                                    <Textarea label={t.contactUs.message} minLength={1} register={register("message")} error={errors.message} required watch={watch} />
                                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
                                </div>
                                <div className="flex justify-center">
                                    <button type="submit" disabled={isLoading} className="btn-theme">
                                        {isLoading ? t.contactUs.sending : t.contactUs.sendMessage}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default ContactUs;
