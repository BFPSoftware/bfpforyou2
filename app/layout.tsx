import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/general/footer/Footer";
import Head from "next/head";

import { Locale, locales } from "@/types/locales";

const languages = locales;

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }));
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
    const { lang } = await params;
    return (
        <html lang="en">
            <Head>
                <title>BFP Gifts</title>
                <meta property="og:title" content="BFP Gifts" key="title" />
            </Head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
                <Footer lang={lang} />
            </body>
        </html>
    );
}
