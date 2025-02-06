import type { Metadata } from "next";
import { getDictionary } from "./dictionaries";
import DictionaryProvider from "@/common/locales/Dictionary-provider";
import { Locale } from "@/types/locales";

export const metadata: Metadata = {
    title: "BFP for You",
    description: "BFP for You is a project of Bridges for Peace",
};

type Params = Promise<{ lang: Locale }>;
export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Params;
}>) {
    const lang = (await params).lang;
    const dictionary = await getDictionary(lang);
    return (
        <section>
            <DictionaryProvider dictionary={dictionary}>{children}</DictionaryProvider>
        </section>
    );
}
