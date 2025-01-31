"use client";
import Header from "@/components/general/header menu/Header";
import React, { Usable, use, useState } from "react";
import Image from "next/image";
import flag from "@/public/images/flags.jpg";
import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Locale } from "./dictionaries";
import { Dictionary, useDictionary } from "@/common/locales/Dictionary-provider";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { loginUser } from "./actions/login";
import { checkCode } from "./actions/checkCode";

export default function Home({ params }: { params: Usable<{ lang: Locale }> }) {
    const { lang } = use(params);
    const t = useDictionary();
    //const { t } = useTranslation(lang, "common", { useSuspense: false });
    const [code, setCode] = useState("");
    const [isCodeValid, setIsCodeValid] = useState<true | false | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    //const router = useRouter();
    // 10 digits number
    const isInputValid = /^\d{1,9}$/.test(code);
    const handleCheckCode = async (e: any) => {
        const res = await checkCode({ code });

        // Result keys.
        if (res?.data) {
            if (res?.data?.success) {
                console.log("res", res?.data);
                setIsCodeValid(true);
            } else if (res?.data?.failure) {
                setIsCodeValid(false);
                console.log("res", res?.data);
            }
        } else if (res?.validationErrors) {
            setIsCodeValid(false);
            console.log("res", res?.validationErrors);
        } else if (res?.serverError) {
            setIsCodeValid(false);
            console.log("res", res?.serverError);
        }
        return;
    };
    return (
        <>
            {isLoading && <Spinner isLoading={isLoading} />}
            <Header />
            <main className="flex bg-slate-300 h-auto flex-col items-center text-center justify-evenly p-[10%] md:p-24">
                <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 font-serif mb-5">{t.home.startHere}</h1>
                <div className="w-screen flex justify-center">
                    <Image src={flag} alt="flag" width={1000} height={2000} />
                </div>
                <h2 className="my-4 text-lg text-gray-500 italic font-serif">{t.home.missionStatement}</h2>
                <form className="w-full">
                    <input placeholder={t.home.haveCode} pattern="[0-9]*" inputMode="numeric" value={code} onChange={(e) => setCode(e.currentTarget.value)} className="w-full max-w-80 border text-md md:text-xl p-5 mt-5 mx-4" />
                    {isCodeValid == false && <p className="text-red-500">{t.home.invalidCode}</p>}
                    <Button type="button" variant="default" size="default" onClick={handleCheckCode}>
                        {t.button.check}
                    </Button>
                </form>
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
                {/* <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle> */}
                <AlertDialogDescription className="text-lg">{t.home.noCodeDialog}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>{t.button.back}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);
