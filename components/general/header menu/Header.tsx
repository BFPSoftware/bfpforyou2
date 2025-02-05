"use client";
import React from "react";
import SelectLanguage from "./SelectLanguage";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();
    const getNewPath = () => {
        const segments = pathname.split("/");
        const currentLocale = segments[1]; // Assuming the locale is the first segment of the path
        return `/${currentLocale}`;
    };
    return (
        <header className="flex justify-around content-center bg-theme">
            <Link href={getNewPath()}>
                <Image alt="Home" width={1000} height={1000} src={logo} className="w-28 h-10 m-4" />
            </Link>
            <SelectLanguage />
        </header>
    );
};

export default Header;
