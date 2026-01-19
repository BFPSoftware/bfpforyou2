"use client";

import { useDictionary } from "@/common/locales/Dictionary-provider";
import Link from "next/link";
import React from "react";

const Footer = () => {
    const t = useDictionary();
    return (
        <footer className="flex justify-around content-center bg-theme underline">
            {/*
              Temporarily removed per request (bots/spam + UX change).
              To restore: uncomment the Link below.
            */}
            {/* <Link href="/contact-us" className="p-4 hover:text-blue-500">
                {t.home.gotoSupport}
            </Link> */}
        </footer>
    );
};

export default Footer;
