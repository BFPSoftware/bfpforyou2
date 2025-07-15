"use client";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import Header from "@/components/general/header menu/Header";
import Footer from "@/components/general/footer/Footer";
import React from "react";

const ThankYouPage: React.FC = () => {
    const t = useDictionary();
    const goToHomePage = () => {
        window.location.href = "/";
    };

    return (
        <>
            <Header />
            <main className="flex bg-slate-300 min-h-[90svh] flex-col items-center justify-start p-[5%] md:p-[10%]">
                <h1 className="text-4xl font-bold mb-4">{t.contactUs.thankYou}</h1>
                <p className="text-lg text-gray-600 mb-8">{t.contactUs.responseTime}</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={goToHomePage}>
                    {t.contactUs.backToHome}
                </button>
            </main>
            <Footer />
        </>
    );
};

export default ThankYouPage;
