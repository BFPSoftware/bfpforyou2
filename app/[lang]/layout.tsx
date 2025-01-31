import type { Metadata } from "next";
import "./../globals.css";
//import { dir } from "i18next";
import { getDictionary, Locale } from "./dictionaries";
import DictionaryProvider from "@/common/locales/Dictionary-provider";
import { Usable, use } from "react";

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
    const dictionary = await getDictionary(lang, "common"); // en
    return (
        <html lang={lang}>
            <body>
                <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
            </body>
        </html>
    );
}
