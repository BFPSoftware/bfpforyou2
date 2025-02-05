import type { Metadata } from "next";
// import "./../globals.css";
//import { dir } from "i18next";
import { getDictionary } from "./dictionaries";
import DictionaryProvider from "@/common/locales/Dictionary-provider";
import { Usable, use } from "react";
import { Locale } from "@/types/locales";

export const metadata: Metadata = {
    title: "BFP for You",
    description: "BFP for You is a project of Bridges for Peace",
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}>) {
    const lang = (await params).lang;
    const dictionary = await getDictionary(lang);
    return (
        <section>
            <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
        </section>
    );
}
