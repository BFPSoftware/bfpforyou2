"use client";
import React from "react";
import { Locale } from "@/types/locales";
import { useRouter, useSearchParams } from "next/navigation";
import NewImmigrantForm from "@/features/forms/immigrant/Form";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import HeaderNoSelectLang from "@/components/general/header menu/HeaderNoSelectLang";

const Immigrant = () => {
    // validate ticket
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticket = searchParams.get("ticket");
    if (typeof window !== "undefined" && !ticket) router.push("/");
    return (
        <>
            <HeaderNoSelectLang />
            <div className="flex bg-slate-300 h-auto flex-col items-center justify-evenly p-[5%] md:p-24">
                <NewImmigrantForm ticket={ticket as string} />
            </div>
        </>
    );
};

export default Immigrant;
