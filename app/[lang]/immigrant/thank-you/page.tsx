"use client";
import Header from "@/components/general/header menu/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ThankYouPage = () => {
    const pathname = usePathname();
    const getNewPath = () => {
        const segments = pathname.split("/");
        const currentLocale = segments[1]; // Assuming the locale is the first segment of the path
        return `/${currentLocale}`;
    };

    return (
        <>
            <Header />
            <main className="flex bg-slate-300 h-[90svh] flex-col items-center text-center justify-evenly p-[10%] md:p-24">
                <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
                <p className="text-lg text-gray-600 mb-8">Your form has been submitted successfully.</p>
                <Link className="btn-theme" href={getNewPath()}>
                    Back to Home
                </Link>
            </main>
        </>
    );
};

export default ThankYouPage;
