"use client";
import React, { useState } from "react";
import LanguageIcon from "../../icons/LanguageIcon";
import ReactModal from "react-modal";
import Link from "next/link";
import { Locale } from "@/app/[lang]/dictionaries";
import { useDictionary } from "@/common/locales/Dictionary-provider";

export default function SelectLanguage() {
    const dictionary = useDictionary();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    return (
        <>
            <button className="flex justify-between items-center ml-2 w-24" onClick={toggleMenu}>
                <LanguageIcon />
                {getLangName(dictionary.lang as Locale)}
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
                        maxWidth: "16rem",
                        backgroundColor: "#1a202c",
                        color: "white",
                        overflow: "auto",
                        padding: "1rem",
                    },
                }}
                ariaHideApp={false}
            >
                <button className="ml-2 md:hidden" onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} className="transition-transform duration-300 transform" />
                    </svg>
                </button>
                <div className="flex flex-col content-between justify-between">
                    <Link className="mt-2 text-center" href={"/en"}>
                        {getLangName("en")}
                    </Link>
                    <Link className="mt-2 text-center" href={"/he"}>
                        {getLangName("he")}
                    </Link>
                    <Link className="mt-2 text-center" href={"/ru"}>
                        {getLangName("ru")}
                    </Link>
                    <Link className="mt-2 text-center" href={"/es"}>
                        {getLangName("es")}
                    </Link>
                    <Link className="mt-2 text-center" href={"/fr"}>
                        {getLangName("fr")}
                    </Link>
                </div>
            </ReactModal>
        </>
    );
}
