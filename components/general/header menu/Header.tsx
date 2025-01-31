"use client";
import React, { Usable, use } from "react";
import SelectLanguage from "./SelectLanguage";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";
import { Language } from "@/lib/i18n/settings";

const Header = ({ lang }: { lang: Language }) => {
    return (
        <header className="flex justify-around content-center bg-theme">
            <Link href={"/"}>
                <Image alt="Home" width={1000} height={1000} src={logo} className="w-28 h-10 m-4" />
            </Link>
            <SelectLanguage lang={lang} />
        </header>
    );
};

export default Header;
