"use client";
import React from "react";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";
import { usePathname } from "next/navigation";

const HeaderNoSelectLang = () => {
    return (
        <header className="flex justify-around content-center bg-theme">
            {/* <Link href={getNewPath()}> */}
            <Image alt="Home" width={1000} height={1000} src={logo} className="w-28 h-10 m-4" />
            {/* </Link> */}
        </header>
    );
};

export default HeaderNoSelectLang;
