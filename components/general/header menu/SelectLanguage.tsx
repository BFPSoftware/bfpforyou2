"use client";
import React, { useState } from "react";
import LanguageIcon from "../../icons/LanguageIcon";
import ReactModal from "react-modal";
import Link from "next/link";
import { Locale } from "@/types/locales";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import { usePathname, useSearchParams } from "next/navigation";

export default function SelectLanguage() {
    const t = useDictionary();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const getLangName = (lang: Locale) => {
        switch (lang) {
            case "en":
                return "English";
            case "he":
                return "עִברִית";
            case "ru":
                return "Русский";
            case "es":
                return "Español";
            case "fr":
                return "Français";
            default:
                return "English";
        }
    };
    const getNewPath = (newLocale: Locale) => {
        const segments = pathName.split("/");
        segments[1] = newLocale; // Replace the locale segment
        const newPath = segments.join("/");
        const queryString = searchParams.toString();
        return queryString ? `${newPath}?${queryString}` : newPath;
    };
    return (
        <>
            <button className="flex justify-between items-center ml-2 w-24" onClick={toggleMenu}>
                <LanguageIcon />
                {getLangName(t.lang as Locale)}
            </button>
            <ReactModal
                isOpen={isMenuOpen}
                onRequestClose={toggleMenu}
                style={{
                    overlay: {
                        backgroundColor: "transparent",
                    },
                    content: {
                        top: "0",
                        left: "auto",
                        right: "0",
                        bottom: "0",
                        width: "40%",
                        maxWidth: "25rem",
                        backgroundColor: "#1a202c",
                        color: "white",
                        overflow: "auto",
                        padding: "1rem",
                    },
                }}
                ariaHideApp={false}
            >
                <button className="ml-2" onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} className="transition-transform duration-300 transform" />
                    </svg>
                </button>
                <div className="flex flex-col content-between justify-between text-xl md:text-2xl">
                    {/* {locales.map((locale) => (
                        <Link key={locale} className="mt-2 text-center" href={getNewPath(locale as Locale)}>
                            {getLangName(locale)}
                        </Link>
                    ))} */}
                    {(["en", "he", "ru"] as const).map((locale) => (
                        <Link key={locale} className="py-2 rounded-full text-center hover:bg-slate-400" href={getNewPath(locale as Locale)}>
                            {getLangName(locale)}
                        </Link>
                    ))}
                </div>
            </ReactModal>
        </>
    );
}
