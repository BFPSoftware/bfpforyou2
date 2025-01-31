"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewImmigrantForm from "@/features/forms/immigrant/Form";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import Header from "@/components/general/header menu/Header";

const Immigrant: React.FC = () => {
    const dictionary = useDictionary();
    // validate ticket
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticket = searchParams.get("ticket");
    console.log("query", ticket);
    if (typeof window !== "undefined" && !ticket) router.push("/");
    return (
        <>
            <Header />
            <main className="flex bg-slate-300 h-auto flex-col items-center text-center justify-evenly p-[10%] md:p-24">
                <NewImmigrantForm ticket={ticket as string} />
            </main>
        </>
    );
};

export default Immigrant;
