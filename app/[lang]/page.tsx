"use client";
import Header from "@/components/general/header menu/Header";
import React, { Usable, use, useState } from "react";
import Image from "next/image";
import flag from "@/public/images/flags.jpg";
import Spinner from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Locale } from "./dictionaries";
import { useDictionary } from "@/common/locales/Dictionary-provider";

export default function Home({ params }: { params: Usable<{ lang: Locale }> }) {
    const { lang } = use(params);
    const dictionary = useDictionary();
    //const { t } = useTranslation(lang, "common", { useSuspense: false });
    const [code, setCode] = useState("");
    const [isCodeValid, setIsCodeValid] = useState<true | false | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    //const router = useRouter();
    // 10 digits number
    const isInputValid = /^\d{1,9}$/.test(code);
    const handleCheckCode = async (e: any) => {
        return console.log("e", e);
        // try {
        //     e.preventDefault();
        //     if (!isInputValid) return setIsCodeValid(false);
        //     setIsLoading(true);
        //     if (!code) return setIsCodeValid(null);
        //     const res = await checkCode(code);
        //     if (!res) {
        //         setIsCodeValid(false);
        //         console.log("res", res);
        //     } else if (res) {
        //         setIsCodeValid(true);
        //         switch (res.program) {
        //             case "New Immigrant":
        //                 router.push({
        //                     pathname: "/immigrant",
        //                     query: { ticket: code },
        //                 });
        //                 break;
        //             case "FAC Elementary":
        //                 router.push({
        //                     pathname: "/fac",
        //                     query: { ticket: code },
        //                 });
        //                 break;
        //             case "FAC Highschool":
        //                 router.push({
        //                     pathname: "/fac",
        //                     query: { ticket: code },
        //                 });
        //                 break;
        //             default:
        //                 alert("Something went wrong");
        //                 throw new Error("program not found");
        //         }
        //     }
        //     setIsLoading(false);
        // } catch (e) {
        //     handleCatch(e, { code: code }, "handleCheckCode");
        // }
    };
    return (
        <>
            {isLoading && <Spinner isLoading={isLoading} />}
            <Header lang={lang} />
            <main className="flex bg-slate-300 h-auto flex-col items-center text-center justify-evenly p-[10%] md:p-24">
                <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 font-serif mb-5">{dictionary.home.startHere}</h1>
                <div className="w-screen flex justify-center">
                    <Image src={flag} alt="flag" width={1000} height={2000} />
                </div>
                <h2 className="my-4 text-lg text-gray-500 italic font-serif">{dictionary.home.missionStatement}</h2>
                <form className="w-full">
                    <input placeholder={dictionary.home.haveCode} pattern="[0-9]*" inputMode="numeric" value={code} onChange={(e) => setCode(e.currentTarget.value)} className="w-full max-w-80 border text-md md:text-xl p-5 mt-5 mx-4" />
                    {isCodeValid == false && <p className="text-red-500">{dictionary.home.invalidCode}</p>}
                    <Button type="button" variant="default" size="default" onClick={handleCheckCode}>
                        {dictionary.button.check}
                    </Button>
                </form>

                <p className="btn-theme">{dictionary.home.noCode}</p>
            </main>
        </>
    );
}
