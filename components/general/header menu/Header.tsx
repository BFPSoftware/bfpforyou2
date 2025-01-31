"use client";
import React, { Usable, use } from "react";
import SelectLanguage from "./SelectLanguage";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";

const Header = () => {
    return (
        <header className="flex justify-around content-center bg-theme">
            <Link href={"/"}>
                <Image alt="Home" width={1000} height={1000} src={logo} className="w-28 h-10 m-4" />
            </Link>
            <SelectLanguage />
        </header>
    );
};

export default Header;
