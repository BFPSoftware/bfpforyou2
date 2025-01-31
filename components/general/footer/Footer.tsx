import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import Link from "next/link";
import React from "react";

const Footer = async ({ lang }: { lang: Locale }) => {
    //const dictionary = await getDictionary(lang, "common"); // en
    return (
        <footer className="flex justify-around content-center bg-theme underline">
            <Link href="/contact-us" className="p-4 hover:text-blue-500">
                {}
            </Link>
        </footer>
    );
};

export default Footer;
