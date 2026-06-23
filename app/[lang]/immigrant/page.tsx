"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewImmigrantForm from "@/features/forms/immigrant/Form";
import HeaderNoSelectLang from "@/components/general/header menu/HeaderNoSelectLang";
import Spinner from "@/components/spinner/Spinner";

const Immigrant = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticket = searchParams.get("ticket");

    useEffect(() => {
        if (!ticket) router.replace("/");
    }, [ticket, router]);

    if (!ticket) {
        return (
            <>
                <HeaderNoSelectLang />
                <Spinner isLoading />
            </>
        );
    }

    return (
        <>
            <HeaderNoSelectLang />
            <div className="flex bg-slate-300 h-auto flex-col items-center justify-evenly p-[5%] md:p-24">
                <NewImmigrantForm ticket={ticket} />
            </div>
        </>
    );
};

export default Immigrant;
