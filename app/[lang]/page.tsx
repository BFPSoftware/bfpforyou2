"use client";
import Header from "@/components/general/header menu/Header";
import React, { useState } from "react";
import Image from "next/image";
import flag from "@/public/images/flags.jpg";
import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Dictionary, useDictionary } from "@/common/locales/Dictionary-provider";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { checkCode } from "./actions/kintone/checkCode";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
    const t = useDictionary();
    const [code, setCode] = useState("");
    const [isCodeValid, setIsCodeValid] = useState<true | false>(true);
    const [isLoading, setIsLoading] = useState(false);
    // 10 digits number
    const isInputValid = /^\d{1,9}$/.test(code);
    const router = useRouter();
    const pathname = usePathname();
    const handleNavigation = (path: string, params: { [key: string]: string }) => {
        const segments = pathname.split("/");
        const currentLocale = segments[1]; // Assuming the locale is the first segment of the path
        const queryString = new URLSearchParams(params).toString();
        router.push(`/${currentLocale}${path}?${queryString}`);
    };
    const handleCheckCode = async (e: any) => {
        e.preventDefault();
        if (!isInputValid) {
            setIsCodeValid(false);
            return;
        } else if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await checkCode({ code });

            // Result keys.
            if (res?.data) {
                const { success, failure } = res?.data;
                if (success) {
                    switch (success) {
                        case "FAC Elementary":
                            handleNavigation("/facelem", { ticket: code });
                            break;
                        case "FAC Highschool":
                            handleNavigation("/fachigh", { ticket: code });
                            break;
                        case "New Immigrant":
                            handleNavigation("/immigrant", { ticket: code });
                            break;
                        default:
                            setIsCodeValid(false);
                            alert("Something went wrong. Please try again later.");
                            break;
                    }
                    setIsCodeValid(true);
                } else if (failure) {
                    setIsCodeValid(false);
                }
            } else if (res?.validationErrors) {
                setIsCodeValid(false);
            } else if (res?.serverError) {
                setIsCodeValid(false);
            }
        } catch (e) {
            setIsCodeValid(false);
        } finally {
            setIsLoading(false);
        }
        return;
    };
    const handleOnChange = (e: any) => {
        if (isInputValid) {
            setIsCodeValid(true);
        }
        setCode(e.currentTarget.value);
    };
    return (
        <>
            {isLoading && <Spinner isLoading={isLoading} />}
            <Header />
            <main className="flex bg-slate-300 h-auto flex-col items-center text-center justify-evenly p-[5%] md:p-[10%] md:p-24">
                <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 font-serif mb-5">{t.home.startHere}</h1>
                <div className="w-[95svw] flex justify-center">
                    <div className="relative w-full h-[400px]">
                        <Image src={flag} alt="flag" priority className="absolute inset-0 w-full h-full object-cover" quality={100} />
                    </div>
                </div>
                <h2 className="my-4 text-lg text-gray-500 italic font-serif">{t.home.missionStatement}</h2>
                <form onSubmit={handleCheckCode} className="flex justify-center items-center w-full">
                    <input placeholder={t.home.haveCode} value={code} onChange={handleOnChange} className="w-full max-w-80 text-md text-center md:text-2xl p-5 mx-4" />
                    <Button type="submit" variant="default" size="default">
                        {t.button.check}
                    </Button>
                </form>
                {isCodeValid == false && <p className="text-red-500">{t.home.invalidCode}</p>}

                <div className="mt-8">
                    <AlertHaveNoCode t={t} />
                </div>
            </main>
        </>
    );
}

const AlertHaveNoCode = ({ t }: { t: Dictionary }) => (
    <AlertDialog>
        <AlertDialogTrigger className="btn-theme">{t.home.noCode}</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle hidden>Have No Code?</AlertDialogTitle>
                <AlertDialogDescription className="text-lg">{t.home.noCodeDialog}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>{t.button.back}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);
